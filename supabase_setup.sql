-- 1. Cria a tabela de Vendedores
CREATE TABLE IF NOT EXISTS public.vendedores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    role TEXT DEFAULT 'vendedor' CHECK (role IN ('admin', 'vendedor')),
    nome TEXT NOT NULL,
    cargo TEXT,
    foto_url TEXT,
    limite_desconto_maximo NUMERIC DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Insere um usuário Admin padrão (se não existir)
INSERT INTO public.vendedores (email, senha, role, nome, cargo, limite_desconto_maximo)
VALUES ('admin@valitag.com.br', 'admin123', 'admin', 'Administrador Mestre', 'Diretoria', 100)
ON CONFLICT (email) DO NOTHING;

-- 3. Atualiza a tabela leads_roi (se ela já existir) para suportar o salvamento das propostas
ALTER TABLE public.leads_roi ADD COLUMN IF NOT EXISTS vendedor_id UUID REFERENCES public.vendedores(id);
ALTER TABLE public.leads_roi ADD COLUMN IF NOT EXISTS dados_proposta JSONB;

-- 4. Desabilita RLS por enquanto para simplificar o acesso direto pelo App
ALTER TABLE public.vendedores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads_roi DISABLE ROW LEVEL SECURITY;
