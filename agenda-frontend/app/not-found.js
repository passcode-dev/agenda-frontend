export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center space-y-6">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-48 h-48 text-gray-500 mb-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 15s1.5-2 4-2 4 2 4 2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
                <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
                <p className="text-lg mb-6">
                    Desculpe, não conseguimos encontrar a página que você está procurando.
                </p>
                <a
                    href="/auth"
                    className="px-6 py-3 rounded-lg bg-gray-700 "
                >
                    Voltar para a Página Inicial
                </a>
            </div>
        </div>
    );
}
