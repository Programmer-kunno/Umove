const tasks = [];

export const startTask = (taskName, callback, interval = 30000) => {
  const taskService = setInterval(callback, interval)

  tasks[taskName] = {
    ...tasks[taskName],
    interval: taskService
  };
}

export const finishTask = (taskName) => {
  if(!checkTaskIsOngoing(taskName)) return;
  
  const intervalToClear = tasks[taskName].interval;
  tasks[taskName].interval = undefined;
  return clearInterval(intervalToClear);
}

export const checkTaskIsOngoing = (taskName) => {
  if(tasks[taskName]?.interval) { 
    return true
  } else {
    return false
  }
}