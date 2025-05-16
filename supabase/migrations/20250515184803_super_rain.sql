/*
  # Create polling system tables

  1. New Tables
    - `usuarios` (users)
      - `id` (serial4, primary key)
      - `nome` (text)
      - `email` (text, unique)
      - `senha_hash` (text)
      - `tipo` (text)
      - `ativo` (bool)
      - `criado_em` (timestamp)

    - `pesquisadores` (researchers)
      - `id` (serial4, primary key)
      - `usuario_id` (int4, foreign key)
      - `dispositivo_id` (text)
      - `ultimo_acesso` (timestamp)

    - `pesquisas` (surveys)
      - `id` (serial4, primary key)
      - `pesquisador_id` (int4, foreign key)
      - `data_hora` (timestamp)
      - `latitude` (float8)
      - `longitude` (float8)
      - `sexo` (text)
      - `idade` (int4)
      - `renda` (text)
      - `escolaridade` (text)
      - `religiao` (text)
      - `satisfacao_servicos` (text)
      - `problemas` (text)
      - `conhece_politicos` (text)
      - `confianca` (float8)
      - `politicos_conhecidos` (text)
      - `vai_votar` (text)
      - `influencia_voto` (text)
      - `interesse` (float8)
      - `opiniao` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create usuarios table
CREATE TABLE IF NOT EXISTS usuarios (
  id serial4 PRIMARY KEY,
  nome text NOT NULL,
  email text UNIQUE NOT NULL,
  senha_hash text NOT NULL,
  tipo text NOT NULL,
  ativo bool DEFAULT true,
  criado_em timestamp with time zone DEFAULT now()
);

-- Create pesquisadores table
CREATE TABLE IF NOT EXISTS pesquisadores (
  id serial4 PRIMARY KEY,
  usuario_id int4 REFERENCES usuarios(id) ON DELETE CASCADE,
  dispositivo_id text NOT NULL,
  ultimo_acesso timestamp with time zone DEFAULT now()
);

-- Create pesquisas table
CREATE TABLE IF NOT EXISTS pesquisas (
  id serial4 PRIMARY KEY,
  pesquisador_id int4 REFERENCES pesquisadores(id) ON DELETE CASCADE,
  data_hora timestamp with time zone DEFAULT now(),
  latitude float8 NOT NULL,
  longitude float8 NOT NULL,
  sexo text NOT NULL,
  idade int4 NOT NULL,
  renda text NOT NULL,
  escolaridade text NOT NULL,
  religiao text NOT NULL,
  satisfacao_servicos text NOT NULL,
  problemas text NOT NULL,
  conhece_politicos text NOT NULL,
  confianca float8 NOT NULL,
  politicos_conhecidos text NOT NULL,
  vai_votar text NOT NULL,
  influencia_voto text NOT NULL,
  interesse float8 NOT NULL,
  opiniao text NOT NULL
);

-- Enable Row Level Security
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pesquisadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pesquisas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Usuarios podem ver seus próprios dados"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admins podem ver todos os usuários"
  ON usuarios
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'tipo' = 'admin');

CREATE POLICY "Pesquisadores podem ver seus próprios dados"
  ON pesquisadores
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = pesquisadores.usuario_id
    AND usuarios.id::text = auth.uid()::text
  ));

CREATE POLICY "Admins podem ver todos os pesquisadores"
  ON pesquisadores
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id::text = auth.uid()::text
    AND usuarios.tipo = 'admin'
  ));

CREATE POLICY "Pesquisadores podem ver suas próprias pesquisas"
  ON pesquisas
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pesquisadores
    WHERE pesquisas.pesquisador_id = pesquisadores.id
    AND pesquisadores.usuario_id::text = auth.uid()::text
  ));

CREATE POLICY "Admins podem ver todas as pesquisas"
  ON pesquisas
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id::text = auth.uid()::text
    AND usuarios.tipo = 'admin'
  ));