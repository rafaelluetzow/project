import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <nav className="bg-white shadow">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Imóveis & Empregos
            </Link>
            <div className="ml-10 space-x-4">
              <Link href="/properties" className="nav-link">
                Imóveis
              </Link>
              <Link href="/jobs" className="nav-link">
                Vagas
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <span>Carregando...</span>
            ) : session ? (
              <>
                {session.user.isAdvertiser && (
                  <>
                    <Link href="/properties/new" className="nav-link">
                      Anunciar Imóvel
                    </Link>
                    <Link href="/jobs/new" className="nav-link">
                      Anunciar Vaga
                    </Link>
                  </>
                )}
                <span className="text-sm text-gray-700">
                  Olá, {session.user.username}
                </span>
                <button
                  onClick={() => signOut()}
                  className="btn-secondary"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-link">
                  Entrar
                </Link>
                <Link href="/register" className="btn">
                  Registrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
