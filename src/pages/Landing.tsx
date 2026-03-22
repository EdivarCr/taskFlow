import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-8 h-8 text-blue-500" />
          <span className="text-2xl font-semibold text-gray-800">TaskFlow</span>
        </div>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-6 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            Entrar
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium"
          >
            Cadastrar
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Organize suas tarefas de forma simples
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Gerencie suas atividades diárias com uma interface clean e intuitiva.
            Aumente sua produtividade e mantenha tudo sob controle.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md hover:shadow-lg font-semibold text-lg"
            >
              Começar agora
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-md hover:shadow-lg font-semibold text-lg border border-gray-200"
            >
              Já tenho conta
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <CheckCircle2 className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Simples e Intuitivo</h3>
            <p className="text-gray-600 leading-relaxed">
              Interface clean e fácil de usar, focada no que realmente importa
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Organize por Status</h3>
            <p className="text-gray-600 leading-relaxed">
              Gerencie suas tarefas em diferentes estados: rascunho, a fazer, fazendo e concluído
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <CheckCircle2 className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Acesse de Qualquer Lugar</h3>
            <p className="text-gray-600 leading-relaxed">
              Totalmente responsivo, funciona perfeitamente em todos os dispositivos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
