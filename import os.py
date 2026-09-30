import os
import json
import requests
from flask import Flask, render_template_string, request, jsonify

app = Flask(__name__)
DATA_FILE = "pokedex_catalog.json"

# --- GERENCIAMENTO DO BANCO DE DADOS LOCAL (JSON) ---
def load_catalog():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def save_catalog(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# --- ROTAS DA API ---
@app.route("/")
def index():
    return render_template_string(HTML_LAYOUT)

@app.route("/api/buscar/<nome>")
def buscar_pokemon(nome):
    """Busca o Pokémon direto na PokéAPI"""
    try:
        url = f"https://pokeapi.co/api/v2/pokemon/{nome.lower().strip()}"
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            data = res.json()
            # Pega a arte oficial se existir, senão usa o sprite padrão
            foto = (data["sprites"]["other"]["official-artwork"]["front_default"] 
                    or data["sprites"]["front_default"])
            tipos = [t["type"]["name"].capitalize() for t in data["types"]]
            return jsonify({
                "sucesso": True,
                "id": data["id"],
                "nome": data["name"].capitalize(),
                "foto": foto,
                "tipos": tipos
            })
    except Exception as e:
        print(f"Erro ao buscar na API: {e}")
    
    return jsonify({"sucesso": False}), 444

@app.route("/api/catalogar", methods=["POST"])
def catalogar():
    """Salva um Pokémon no catálogo local"""
    payload = request.json
    nome = payload.get("nome", "").strip()
    tipo_manual = payload.get("tipo", "").strip()

    if not nome:
        return jsonify({"error": "Nome é obrigatório"}), 400

    catalog = load_catalog()

    # Tenta puxar dados reais da PokéAPI
    res = requests.get(f"https://pokeapi.co/api/v2/pokemon/{nome.lower()}", timeout=5)
    if res.status_code == 200:
        data = res.json()
        foto = (data["sprites"]["other"]["official-artwork"]["front_default"] 
                or data["sprites"]["front_default"])
        pokedex_num = f"#{data['id']:03d}"
        tipos_api = [t["type"]["name"].capitalize() for t in data["types"]]
        tipo_final = ", ".join(tipos_api) if tipos_api else tipo_manual
    else:
        # Fallback se não achar na API ou se estiver sem internet
        foto = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
        pokedex_num = "#---"
        tipo_final = tipo_manual or "Normal"

    novo_pokemon = {
        "id": len(catalog) + 1,
        "nome": nome.capitalize(),
        "tipo": tipo_final,
        "num": pokedex_num,
        "foto": foto
    }

    catalog.append(novo_pokemon)
    save_catalog(catalog)
    return jsonify({"sucesso": True, "pokemon": novo_pokemon})

@app.route("/api/listar")
def listar():
    return jsonify(load_catalog())

@app.route("/api/deletar/<int:poke_id>", methods=["DELETE"])
def deletar(poke_id):
    catalog = load_catalog()
    catalog = [p for p in catalog if p["id"] != poke_id]
    save_catalog(catalog)
    return jsonify({"sucesso": True})

# --- INTERFACE MOBILE (HTML + TAILWIND CSS) ---
HTML_LAYOUT = """
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pokémon Catalog</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
    body { font-family: 'Poppins', sans-serif; }
  </style>
</head>
<body class="bg-blue-500 min-h-screen flex items-center justify-center p-0 sm:p-4">

  <!-- Container Mobile -->
  <div class="w-full max-w-[390px] bg-gray-100 min-h-screen sm:min-h-[800px] sm:rounded-[40px] shadow-2xl flex flex-col justify-between overflow-hidden relative border-4 border-slate-900">
    
    <!-- Cabeçalho -->
    <div class="p-6 pb-2 text-center">
      <div class="flex items-center justify-center gap-2">
        <div class="w-6 h-6 rounded-full border-2 border-slate-800 bg-red-600 flex items-center justify-center relative overflow-hidden">
          <div class="absolute bottom-0 w-full h-1/2 bg-white border-t border-slate-800"></div>
          <div class="w-2 h-2 rounded-full bg-white border border-slate-800 z-10"></div>
        </div>
        <h1 class="text-2xl font-bold text-[#1E2A44]">Pokémon Catalog</h1>
      </div>
    </div>

    <!-- Área de Conteúdo / Formulário -->
    <div class="p-6 pt-2 flex-1 overflow-y-auto">
      
      <!-- Pokébola Central / Preview -->
      <div class="flex justify-center my-4 relative">
        <div id="poke-preview" class="w-36 h-36 rounded-full border-4 border-slate-900 bg-white relative overflow-hidden shadow-lg flex items-center justify-center transition-all">
          <div class="absolute top-0 w-full h-1/2 bg-[#FF1F3D]"></div>
          <div class="absolute bottom-0 w-full h-1/2 bg-white"></div>
          <div class="absolute w-full h-2 bg-slate-900 top-1/2 -translate-y-1/2 z-10"></div>
          <div class="w-8 h-8 rounded-full bg-white border-4 border-slate-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"></div>
          <img id="poke-img" src="" class="hidden w-28 h-28 object-contain z-30 transition-transform hover:scale-110" />
        </div>
      </div>

      <!-- Formulário -->
      <form id="catalog-form" onsubmit="salvarPokemon(event)" class="space-y-4">
        
        <!-- Campo Nome -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Nome do Pokémon</label>
          <div class="relative">
            <i data-lucide="user" class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input type="text" id="poke-name" oninput="testarBusca(this.value)" placeholder="Ex: Pikachu" required
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm shadow-sm">
          </div>
        </div>

        <!-- Campo Tipo -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Tipo</label>
          <div class="relative">
            <i data-lucide="tag" class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <select id="poke-type" class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm shadow-sm appearance-none">
              <option value="">Selecione o tipo</option>
              <option value="Normal">Normal</option>
              <option value="Fogo">Fogo</option>
              <option value="Água">Água</option>
              <option value="Elétrico">Elétrico</option>
              <option value="Planta">Planta</option>
              <option value="Gelo">Gelo</option>
              <option value="Lutador">Lutador</option>
              <option value="Veneno">Veneno</option>
              <option value="Terra">Terra</option>
              <option value="Voador">Voador</option>
              <option value="Psíquico">Psíquico</option>
              <option value="Inseto">Inseto</option>
              <option value="Pedra">Pedra</option>
              <option value="Fantasma">Fantasma</option>
              <option value="Dragão">Dragão</option>
              <option value="Sombrio">Sombrio</option>
              <option value="Aço">Aço</option>
              <option value="Fada">Fada</option>
            </select>
          </div>
        </div>

        <!-- Botão Catalogar -->
        <button type="submit" class="w-full bg-[#FF1F3D] hover:bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">
          <i data-lucide="book-open" class="w-5 h-5"></i>
          <span>Catalogar</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      </form>

      <!-- Lista / Grid de Salvos -->
      <div class="mt-8">
        <h2 class="text-sm font-bold text-[#1E2A44] mb-3 flex items-center gap-1.5">
          <i data-lucide="list" class="w-4 h-4"></i> Meus Pokémon
        </h2>
        <div id="catalog-list" class="grid grid-cols-2 gap-3 pb-6">
          <!-- Cards injetados via JS -->
        </div>
      </div>

    </div>
  </div>

  <script>
    lucide.createIcons();
    let timeoutBusca = null;

    // Busca prévia na PokéAPI enquanto digita
    function testarBusca(nome) {
      clearTimeout(timeoutBusca);
      const img = document.getElementById('poke-img');
      if (!nome || nome.length < 3) {
        img.classList.add('hidden');
        return;
      }
      
      timeoutBusca = setTimeout(async () => {
        try {
          const res = await fetch(`/api/buscar/${nome}`);
          const data = await res.json();
          if (data.sucesso) {
            img.src = data.foto;
            img.classList.remove('hidden');
          } else {
            img.classList.add('hidden');
          }
        } catch(e) {
          img.classList.add('hidden');
        }
      }, 500);
    }

    // Carrega a lista do backend
    async function carregarLista() {
      const res = await fetch('/api/listar');
      const lista = await res.json();
      const container = document.getElementById('catalog-list');
      container.innerHTML = '';

      if (lista.length === 0) {
        container.innerHTML = `<p class="col-span-2 text-center text-xs text-slate-400 py-4">Nenhum Pokémon catalogado ainda.</p>`;
        return;
      }

      lista.forEach(poke => {
        container.innerHTML += `
          <div class="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center relative group">
            <button onclick="deletarPokemon(${poke.id})" class="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
            <span class="text-[10px] font-bold text-slate-400 self-start">${poke.num}</span>
            <img src="${poke.foto}" class="w-16 h-16 object-contain my-1" />
            <h3 class="font-bold text-xs text-slate-800">${poke.nome}</h3>
            <span class="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium mt-1">${poke.tipo}</span>
          </div>
        `;
      });
      lucide.createIcons();
    }

    // Salva o Pokémon
    async function salvarPokemon(e) {
      e.preventDefault();
      const nome = document.getElementById('poke-name').value;
      const tipo = document.getElementById('poke-type').value;

      const res = await fetch('/api/catalogar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, tipo })
      });

      if (res.ok) {
        document.getElementById('poke-name').value = '';
        document.getElementById('poke-type').value = '';
        document.getElementById('poke-img').classList.add('hidden');
        carregarLista();
      }
    }

    // Apaga um Pokémon
    async function deletarPokemon(id) {
      await fetch(`/api/deletar/${id}`, { method: 'DELETE' });
      carregarLista();
    }

    carregarLista();
  </script>
</body>
</html>
"""

if __name__ == "__main__":
    print("🚀 Servidor Pokémon Catalog iniciando...")
    print("📱 Acesse no seu navegador: http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)