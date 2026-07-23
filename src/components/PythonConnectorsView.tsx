import React, { useState } from 'react';
import { FileCode, Copy, Check, Terminal, Sparkles } from 'lucide-react';

export const PythonConnectorsView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const codeSnippets = [
    {
      title: '1. Conexión Nativa con psycopg2 (Síncrono)',
      library: 'psycopg2-binary',
      description: 'El driver C-level nativo estándar para conectarse a PostgreSQL ejecutando cursores SQL.',
      code: `import psycopg2
from psycopg2.extras import RealDictCursor

# Configuración de conexión
conn_params = {
    "dbname": "company_db",
    "user": "admin_empresa",
    "password": "PasswordSecreta123!",
    "host": "localhost",
    "port": "5432"
}

try:
    # 1. Establecer conexión
    with psycopg2.connect(**conn_params) as conn:
        # 2. Crear cursor con formato Diccionario
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            # 3. Ejecutar consulta parametrizada (evita SQL Injection)
            sql = "SELECT id, nombre, salario FROM empleados WHERE salario > %s;"
            cursor.execute(sql, (3500.00,))
            
            # 4. Obtener resultados
            empleados = cursor.fetchall()
            for emp in empleados:
                print(f"Empleado: \${emp['nombre']} - Salario: \\\$\${emp['salario']}")

except Exception as e:
    print(f"Error en la base de datos: {e}")`
    },
    {
      title: '2. Mapeo ORM Moderno con SQLAlchemy 2.0',
      library: 'sqlalchemy',
      description: 'ORM empresarial para abstraer sentencias SQL mediante clases Python tipadas.',
      code: `from sqlalchemy import create_engine, Column, Integer, String, Numeric, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

# Declaración del Modelo ORM Empleado
class Empleado(Base):
    __tablename__ = 'empleados'
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(50), nullable=False)
    cargo = Column(String(100))
    salario = Column(Numeric(10, 2))
    activo = Column(Boolean, default=True)

# Crear Engine de conexión
engine = create_engine("postgresql+psycopg2://admin_empresa:PasswordSecreta123!@localhost:5432/company_db")
Session = sessionmaker(bind=engine)

# Consultar datos con la sesión
with Session() as session:
    tecnologia_emps = session.query(Empleado).filter(Empleado.salario >= 4000).all()
    for e in tecnologia_emps:
        print(f"ORM: \${e.nombre} (\${e.cargo}) -> \\\$\${e.salario}")`
    },
    {
      title: '3. Conexión Asíncrona de Alto Rendimiento con asyncpg',
      library: 'asyncpg',
      description: 'Driver asíncrono ultra-rápido para frameworks como FastAPI y Tornado.',
      code: `import asyncio
import asyncpg

async def main():
    # Conexión asíncrona a PostgreSQL
    conn = await asyncpg.connect(
        user='admin_empresa',
        password='PasswordSecreta123!',
        database='company_db',
        host='127.0.0.1'
    )
    
    try:
        # Ejecutar consulta asíncrona
        rows = await conn.fetch('SELECT id, nombre, cargo FROM empleados WHERE activo = $1', True)
        for row in rows:
            print(f"Async: #{row['id']} {row['nombre']} - {row['cargo']}")
    finally:
        await conn.close()

asyncio.run(main())`
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
        <div className="flex items-center space-x-2">
          <FileCode className="w-6 h-6 text-teal-400" />
          <h1 className="text-xl font-bold text-white">Guía de Conectores Python para PostgreSQL</h1>
        </div>
        <p className="text-xs text-slate-300">
          Aprende a integrar PostgreSQL con aplicaciones Python utilizando <strong>psycopg2</strong>, <strong>SQLAlchemy ORM</strong> y <strong>asyncpg</strong>.
        </p>
      </div>

      <div className="space-y-6">
        {codeSnippets.map((snippet, idx) => (
          <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{snippet.title}</h3>
                <span className="text-[11px] text-teal-400 font-mono">pip install {snippet.library}</span>
              </div>

              <button
                onClick={() => handleCopy(snippet.code, idx)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === idx ? 'Copiado' : 'Copiar Código'}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-950">
              <pre className="text-xs font-mono text-teal-300 leading-relaxed overflow-x-auto">
                <code>{snippet.code}</code>
              </pre>
            </div>

            <div className="bg-slate-900/60 px-5 py-2.5 border-t border-slate-800 text-xs text-slate-400">
              💡 {snippet.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
