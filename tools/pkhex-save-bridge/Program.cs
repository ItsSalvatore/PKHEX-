using System.Text.Json;
using PKHeX.Core;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors();

var json = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = false,
};

app.MapGet("/health", () => Results.Text("ok"));

app.MapPost("/parse", async (HttpRequest req) =>
{
    try
    {
        await using var ms = new MemoryStream();
        await req.Body.CopyToAsync(ms);
        var bytes = ms.ToArray();
        var fileName = req.Headers["X-File-Name"].ToString();
        if (string.IsNullOrWhiteSpace(fileName))
            fileName = "unknown.sav";

        var sav = SaveUtil.GetSaveFile(bytes, fileName);
        if (sav is null)
        {
            return Results.Json(
                new { ok = false, error = "SaveUtil could not identify this file (same entry point as PKHeX / PKHeX.Everywhere)." },
                json,
                statusCode: 400);
        }

        var party = new string?[6];
        for (var i = 0; i < 6; i++)
        {
            if (i >= sav.PartyCount)
            {
                party[i] = null;
                continue;
            }

            var pk = sav.GetPartySlotAtIndex(i);
            if (pk.Species == 0)
                party[i] = null;
            else
            {
                var buf = new byte[sav.SIZE_PARTY];
                pk.WriteEncryptedDataParty(buf);
                party[i] = Convert.ToBase64String(buf);
            }
        }

        var boxList = new List<BoxDto>(sav.BoxCount);
        for (var b = 0; b < sav.BoxCount; b++)
        {
            var slots = new string?[sav.BoxSlotCount];
            for (var s = 0; s < sav.BoxSlotCount; s++)
            {
                var pk = sav.GetBoxSlotAtIndex(b, s);
                if (pk.Species == 0)
                    slots[s] = null;
                else
                {
                    var buf = new byte[sav.SIZE_BOXSLOT];
                    pk.WriteEncryptedDataStored(buf);
                    slots[s] = Convert.ToBase64String(buf);
                }
            }

            boxList.Add(new BoxDto($"Box {b + 1}", 0, slots));
        }

        var rival = GetRivalName(sav);
        var trainer = new TrainerDto(
            sav.OT,
            sav.TID16,
            sav.SID16,
            sav.DisplayTID.ToString(),
            sav.DisplaySID.ToString(),
            sav.Gender,
            sav.Money,
            sav.Language,
            rival,
            sav.PlayedHours,
            sav.PlayedMinutes,
            sav.PlayedSeconds);

        var payload = new ParseOkDto(
            true,
            sav.GetType().Name,
            (byte)sav.Version,
            sav.Generation,
            sav.ChecksumsValid,
            trainer,
            party,
            boxList,
            sav.BoxCount,
            sav.BoxSlotCount);

        return Results.Json(payload, json);
    }
    catch (Exception ex)
    {
        return Results.Json(new { ok = false, error = ex.Message }, json, statusCode: 500);
    }
});

app.Run("http://127.0.0.1:5177");

static string? GetRivalName(SaveFile sav) => sav switch
{
    SAV1 s1 => s1.RivalName,
    SAV2 s2 => s2.RivalName,
    SAV3FRLG s3 => s3.RivalName,
    SAV4 s4 => s4.RivalName,
    SAV5B2W2 s5 => s5.RivalName,
    _ => null,
};

internal sealed record TrainerDto(
    string Name,
    ushort Tid16,
    ushort Sid16,
    string DisplayTid,
    string DisplaySid,
    byte Gender,
    uint Money,
    int Language,
    string? Rival,
    int PlayedHours,
    int PlayedMinutes,
    int PlayedSeconds);

internal sealed record BoxDto(string Name, int Wallpaper, string?[] Slots);

internal sealed record ParseOkDto(
    bool Ok,
    string SaveType,
    byte PkhexVersion,
    byte Generation,
    bool ChecksumsValid,
    TrainerDto Trainer,
    string?[] PartyBase64,
    List<BoxDto> Boxes,
    int BoxCount,
    int SlotsPerBox);
