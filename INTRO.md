# Dental Cashflow — Guia Rápido

Gestão financeira para clínicas odontológicas.

---

## 1. Primeiro Acesso

### Acessar o sistema

1. Abra o navegador e acesse: **`http://localhost:3000/admin`**
2. Crie sua conta de administrador:
   - Clique em **"Create an account"**
   - Preencha email e senha
   - Seu usuário será criado como **Admin**

### Configurar dados iniciais

Após fazer login no painel admin, crie manualmente os dados base:

#### Categorias
Em **Collections → Categories**, adicione:

Receitas:
- Procedimentos
- Convênios *(ative "Requires Guide")*
- Outras receitas

Despesas:
- Salários
- Aluguel
- Materiais
- Água
- Energia
- Impostos
- Outras despesas

#### Contas
Em **Collections → Accounts**, adicione:

- **Caixa** (tipo: Dinheiro)
- **Banco** (tipo: Banco)
- **Cartão** (tipo: Cartão)

Defina o saldo inicial de cada conta. Ex: se o caixa tem R$ 1.000,00, coloque `100000` (valor em centavos).

#### Formas de Pagamento
Em **Collections → Payment Methods**, adicione:

- Dinheiro
- PIX
- Cartão de débito
- Cartão de crédito
- Transferência
- Boleto
- Convênio
- Outro

#### Operadores (opcional)
Se outras pessoas vão usar o sistema:
1. Em **Collections → Users**, clique em **Create New**
2. Preencha nome, email, senha
3. Em **Role**, selecione **Operator**
4. Salve

> **Admin** pode tudo. **Operator** registra e consulta, mas não exclui nem altera configurações.

---

## 2. Registrar Movimentações

No painel admin ou na interface principal (`http://localhost:3000`):

1. Acesse **Movimentações** no menu lateral
2. Clique em **Nova**
3. Preencha:

| Campo | Instrução |
|---|---|
| Data | Data da movimentação |
| Tipo | Entrada (receita), Saída (despesa) ou Transferência |
| Descrição | Ex: "Consulta paciente João Silva" |
| Conta | Onde o dinheiro entrou/saiu |
| Valor (R$) | Valor em reais |
| Categoria | Classificação da receita/despesa |
| Forma de Pagamento | Como foi pago/recebido |

### Campos especiais

**Transferências**: Quando move dinheiro entre contas (ex: Caixa → Banco). Não aparecem como receita ou despesa.

**Convênios**: Ao selecionar a categoria "Convênios", preencha:
- Número da Guia
- Valor da Guia

---

## 3. Visualizar Resultados

### Dashboard
Acesse **Dashboard** para ver:
- Saldo geral da clínica
- Saldo por conta (Caixa, Banco, Cartão)
- Movimentação diária dos últimos 30 dias
- Resumo mensal dos últimos 12 meses

### Caixa Diário
Acesse **Caixa Diário** para:
- Entradas e saídas de cada dia
- Saldo acumulado

### Caixa Mensal
Acesse **Caixa Mensal** para:
- Total de entradas, saídas e saldo por mês
- Número de movimentações

### Relatórios
Acesse **Relatórios** para:
- **DRE**: Demonstrativo de Resultados — receitas e despesas agrupadas por categoria
- **Exportar Excel**: Baixar planilha com 4 abas (Resumo, Movimentações, Receitas, Despesas)

---

## 4. Filtrar Movimentações

Na página de **Movimentações**, use os filtros no topo:
- Período (data início e fim)
- Tipo (entrada, saída, transferência)
- Categoria
- Conta
- Busca por descrição

Clique no **X** para limpar os filtros.

---

## 5. Editar ou Excluir

- **Editar**: Clique no ícone de lápis na tabela
- **Excluir**: Clique no ícone de lixeira (apenas Admin)

---

## 6. Dicas

- **Valores**: Todos os valores são armazenados em centavos. Digite normalmente em reais (ex: `350,75`).
- **Convênios**: Sempre que lançar uma receita de convênio, preencha o número da guia. Isso facilita a conferência depois.
- **Transferências**: Use transferência para mover dinheiro entre Caixa e Banco. Não é receita nem despesa.
- **Exportação**: Gere o Excel no final do mês para arquivar ou enviar ao contador.

---

## Dúvidas?

Consulte o administrador do sistema ou entre em contato com o desenvolvedor.
