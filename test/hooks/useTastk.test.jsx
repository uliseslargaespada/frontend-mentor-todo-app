/**
 * Unit tests for your real useTasks hook by mocking Supabase.
 *
 * Key concept:
 * - vi.mock is hoisted and runs before imports, so mocks must be declared at top-level. :contentReference[oaicite:11]{index=11}
 *
 * We test:
 * - initial load (success + error)
 * - addTask inserts and updates UI
 * - toggleTask updates local state
 * - deleteTask removes from local state
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach, describe, test, expect } from "vitest";


/**
 * Hoisted mock state so we can access and configure mocks in each test.
 * This prevents the common "cannot access before initialization" problems when mocking ESM modules.
 */
const sb = vi.hoisted(() => {
  // Query chain mocks
  const order = vi.fn();
  const select = vi.fn(() => ({ order }));

  // Insert chain mocks: insert([...]).select()
  const insertSelect = vi.fn();
  const insert = vi.fn(() => ({ select: insertSelect }));

  // Update chain mocks: update({...}).eq("id", id)
  const updateEq = vi.fn();
  const update = vi.fn(() => ({ eq: updateEq }));

  // Delete chain mocks: delete().eq("id", id)
  const deleteEq = vi.fn();
  const del = vi.fn(() => ({ eq: deleteEq }));

  // from("tasks") returns an object with the CRUD methods used by the hook
  const from = vi.fn(() => ({
    select,
    insert,
    update,
    delete: del
  }));

  // Realtime channel mocks
  const channelToken = { __channel: true };
  const channelBuilder = {
    on: vi.fn(() => channelBuilder),
    subscribe: vi.fn(() => channelToken)
  };
  const channel = vi.fn(() => channelBuilder);
  const removeChannel = vi.fn();

  return {
    from,
    select,
    order,

    insert,
    insertSelect,

    update,
    updateEq,

    del,
    deleteEq,

    channel,
    channelBuilder,
    channelToken,
    removeChannel
  };
});

// Mock the Supabase client module your hook imports.
vi.mock("@lib/supabaseClient", () => ({
  supabase: {
    from: sb.from,
    channel: sb.channel,
    removeChannel: sb.removeChannel
  }
}));

// Import useTasks hook
import { useTasks } from "@hooks/useTasks";

/**
 * Minimal harness component for observing hook behavior through the DOM.
 * This avoids needing renderHook and keeps the lesson simpler.
 */
function TasksHarness() {
  const { tasks, loading, error, addTask, toggleTask, deleteTask } = useTasks();

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}

      <button type="button" onClick={() => addTask("New Task")}>
        Add Task
      </button>

      <button
        type="button"
        disabled={!tasks.length}
        onClick={() => toggleTask(tasks[0].id, !tasks[0].is_complete)}
      >
        Toggle First
      </button>

      <button
        type="button"
        disabled={!tasks.length}
        onClick={() => deleteTask(tasks[0].id)}
      >
        Delete First
      </button>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title} - {t.is_complete ? "done" : "todo"}
          </li>
        ))}
      </ul>
    </div>
  );
}

beforeEach(() => {
  // Default: loadTasks returns empty list successfully
  sb.order.mockResolvedValue({ data: [], error: null });

  // Default: insert returns inserted row
  sb.insertSelect.mockResolvedValue({
    data: [{ id: 100, title: "New Task", is_complete: false }],
    error: null
  });

  // Default: update/delete succeed
  sb.updateEq.mockResolvedValue({ error: null });
  sb.deleteEq.mockResolvedValue({ error: null });

  // Realtime channel should not crash
  sb.channelBuilder.on.mockReturnValue(sb.channelBuilder);
  sb.channelBuilder.subscribe.mockReturnValue(sb.channelToken);
});

describe('useTasks (SupabaseMock)', () => {
  test('loads tasks on mount (success)', async () => {
    sb.order.mockResolvedValueOnce({
      data: [{ id: 1, title: "Task A", is_complete: false }],
      error: null
    });

    render(<TasksHarness />);

    // Loading screen
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    expect(await screen.findByText(/Task A/)).toBeInTheDocument();

    // Ensure query chain was used
    expect(sb.from).toHaveBeenCalledWith("tasks");
    expect(sb.select).toHaveBeenCalledWith("*");
    expect(sb.order).toHaveBeenCalled();    
  });

  test('loads tasks on mount (error)', async () => {
    sb.order.mockResolvedValueOnce({
      data: null,
      error: { message: "DB failed" }
    });

    render(<TasksHarness />);

    expect(await screen.findByRole("alert")).toHaveTextContent(/Error loading tasks: DB failed/i);
  });

  test('addTask and update the local state', async () => {
    const user = userEvent.setup();

    // Start empty
    sb.order.mockResolvedValueOnce({ data: [], error: null });

    render(<TasksHarness />);

    await waitFor(() => expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /Add Task/i }));

    // Inserted row appears in the list
    expect(await screen.findByText("New Task - todo")).toBeInTheDocument();

    // Validate insert payload
    expect(sb.insert).toHaveBeenCalledWith([{ title: "New Task", is_complete: false }]);
  });

  test('toggle task and update the local sate', async () => {
    const user = userEvent.setup();

    sb.order.mockResolvedValueOnce({
      data: [{ id: 2, title: "Toggle Me", is_complete: false }],
      error: null
    });

    render(<TasksHarness />);
    expect(await screen.findByText("Toggle Me - todo")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Toggle First/i }));

    // UI reflects local state update
    expect(await screen.findByText("Toggle Me - done")).toBeInTheDocument();

    // Ensure update chain is called
    expect(sb.update).toHaveBeenCalledWith({ is_complete: true });
    expect(sb.updateEq).toHaveBeenCalledWith("id", 2);    
  });

  test('delete task and update the local state', async () => {
    const user = userEvent.setup();

    sb.order.mockResolvedValueOnce({
      data: [{ id: 3, title: "Delete Me", is_complete: false }],
      error: null
    });

    render(<TasksHarness />);
    expect(await screen.findByText("Delete Me - todo")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Delete First/i }));

    await waitFor(() => {
      expect(screen.queryByText("Delete Me - todo")).not.toBeInTheDocument();
    });

    expect(sb.del).toHaveBeenCalled();
    expect(sb.deleteEq).toHaveBeenCalledWith("id", 3);
  });
});
