import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, LogOut, Plus, CreditCard as Edit2, Trash2, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { todosApi, Todo } from '../services/api';
import TaskModal from '../components/TaskModal';

const stateLabels = {
  draft: 'Rascunho',
  todo: 'A Fazer',
  doing: 'Fazendo',
  done: 'Concluído',
  trash: 'Lixeira',
};

const stateColors = {
  draft: 'bg-gray-100 text-gray-700 border-gray-300',
  todo: 'bg-blue-100 text-blue-700 border-blue-300',
  doing: 'bg-amber-100 text-amber-700 border-amber-300',
  done: 'bg-green-100 text-green-700 border-green-300',
  trash: 'bg-red-100 text-red-700 border-red-300',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filterState, setFilterState] = useState<string>('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadTodos();
  }, [user, navigate]);

  useEffect(() => {
    if (filterState === 'all') {
      setFilteredTodos(todos);
    } else {
      setFilteredTodos(todos.filter(todo => todo.state === filterState));
    }
  }, [filterState, todos]);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const response = await todosApi.list();
      setTodos(response.todos || []);
      setFilteredTodos(response.todos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateTodo = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

    try {
      await todosApi.delete(id);
      await loadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar tarefa');
    }
  };

  const handleChangeState = async (todo: Todo, newState: Todo['state']) => {
    try {
      await todosApi.update(todo.id, { state: newState });
      await loadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tarefa');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
    loadTodos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-semibold text-gray-800">TaskFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Olá, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Minhas Tarefas</h1>
          <button
            onClick={handleCreateTodo}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            Nova Tarefa
          </button>
        </div>

        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">Filtrar:</span>
          <button
            onClick={() => setFilterState('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterState === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Todas
          </button>
          {Object.entries(stateLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilterState(key)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterState === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Carregando tarefas...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {filterState === 'all'
                ? 'Nenhuma tarefa encontrada. Crie sua primeira tarefa!'
                : `Nenhuma tarefa com status "${stateLabels[filterState as keyof typeof stateLabels]}"`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{todo.title}</h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${
                          stateColors[todo.state]
                        }`}
                      >
                        {stateLabels[todo.state]}
                      </span>
                    </div>
                    {todo.description && (
                      <p className="text-gray-600 leading-relaxed">{todo.description}</p>
                    )}
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {(Object.keys(stateLabels) as Array<keyof typeof stateLabels>)
                        .filter((state) => state !== todo.state)
                        .map((state) => (
                          <button
                            key={state}
                            onClick={() => handleChangeState(todo, state)}
                            className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                          >
                            Mover para {stateLabels[state]}
                          </button>
                        ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTodo(todo)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <TaskModal
          todo={editingTodo}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
