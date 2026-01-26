import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchTasks, createTask, deleteTask, toggleTask } from '../api/taskApi';

describe('taskApi', () => {
  // Store the original fetch
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn();
  });

  afterEach(() => {
    // Restore original fetch after tests
    global.fetch = originalFetch;
  });

  describe('fetchTasks', () => {
    it('returns tasks on successful response', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false },
        { id: '2', title: 'Task 2', completed: true },
      ];

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTasks),
      } as Response);

      const result = await fetchTasks();

      expect(result).toEqual(mockTasks);
      expect(global.fetch).toHaveBeenCalledWith('/api/tasks');
    });

    it('throws error on failed response', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(fetchTasks()).rejects.toThrow('Failed to fetch tasks');
    });
  });

  // TODO: Add tests for createTask
  // - Test successful creation (mock POST request, verify body and headers)
  // - Test error handling
  describe('createTask', () => {
    it('creates a task on successful response', async () => {
        const mockTask = { id: '3', title: 'New Task', completed: false };
        const newTaskData = { title: 'New Task' };
        vi.mocked(global.fetch).mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockTask),
        } as Response);
        const result = await createTask(newTaskData);
        expect(result).toEqual(mockTask);
        expect(global.fetch).toHaveBeenCalledWith('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTaskData),
        });
      });

      it('throws error on failed creation', async () => {
        const newTaskData = { title: 'New Task' };
        vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
          status: 400,
        } as Response);
        await expect(createTask(newTaskData)).rejects.toThrow('Failed to create task');
      });   

  // TODO: Add tests for deleteTask
  // - Test successful deletion (mock DELETE request)
  // - Test error handling
    describe('deleteTask', () => {  
        it('deletes a task on successful response', async () => {
            vi.mocked(global.fetch).mockResolvedValue({
              ok: true,
            } as Response);
            await expect(deleteTask('3')).resolves.toBeUndefined();
            expect(global.fetch).toHaveBeenCalledWith('/api/tasks/3', {
              method: 'DELETE',
            });
          });

          it('throws error on failed deletion', async () => {
            vi.mocked(global.fetch).mockResolvedValue({
              ok: false,
              status: 404,
            } as Response);
            await expect(deleteTask('3')).rejects.toThrow('Failed to delete task');
          });
    

  // TODO: Add tests for toggleTask
  // - Test successful toggle (mock PATCH request, verify body)
  // - Test error handling
    describe('toggleTask', () => {  
        it('toggles a task on successful response', async () => {
            const updatedTask = { id: '1', title: 'Task 1', completed: true };      
            vi.mocked(global.fetch).mockResolvedValue({
              ok: true,
              json: () => Promise.resolve(updatedTask),
            } as Response);
            const result = await toggleTask('1', true);
            expect(result).toEqual(updatedTask);
            expect(global.fetch).toHaveBeenCalledWith('/api/tasks/1', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ completed: true }),
            });
          });

          it('throws error on failed toggle', async () => {
            vi.mocked(global.fetch).mockResolvedValue({
              ok: false,
              status: 500,
            } as Response);
            await expect(toggleTask('1', true)).rejects.toThrow('Failed to update task');
          });
    });
});
});  
});