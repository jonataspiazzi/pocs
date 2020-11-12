declare module 'tasklist' {
  export interface TasklistConfig {
    /**
     * With the verbose option set to true, it additionally returns the following properties:
     * status 
     * username 
     * cpuTime 
     * windowTitle 
     */
    verbose?: boolean;

  }

  export interface TaskInfo {
    imageName: string;
    pid: number;
    sessionName: string;
    sessionNumber: number;
    memUsage: number;
    status: 'Suspended' | 'Not Responding' | 'Unknown' | 'Running';
    username: string;
    cpuTime: number;
    windowTitle: string;
  }

  export default function (config?: TasklistConfig): Promise<TaskInfo[]>;
}