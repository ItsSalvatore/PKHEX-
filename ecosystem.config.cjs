module.exports = {
  apps: [
    {
      name: 'pkhex-pwa',
      script: 'server.mjs',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 11100,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 11100,
      },

      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/pkhex-error.log',
      out_file: './logs/pkhex-out.log',
      merge_logs: true,
      log_type: 'json',

      // Restart policy
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '512M',
      restart_delay: 4000,
      autorestart: true,

      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 8000,

      // Watch (disabled in prod — enable for dev if needed)
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.git', 'apps/mobile'],
    },
  ],
};
