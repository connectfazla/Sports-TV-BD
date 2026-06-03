declare module 'node-cron' {
  interface ScheduledTask {
    start(): this;
    stop(): this;
    destroy(): void;
  }

  interface ScheduleOptions {
    scheduled?: boolean;
    timezone?: string;
    runOnInit?: boolean;
    recoverMissedExecutions?: boolean;
    name?: string;
  }

  function schedule(
    expression: string,
    func: string | (() => void),
    options?: ScheduleOptions
  ): ScheduledTask;

  function validate(cronExpression: string): boolean;

  const nodeCron: {
    schedule: typeof schedule;
    validate: typeof validate;
  };

  export = nodeCron;
}
