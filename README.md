# Text.Readeer.Zer0
Text.Readeer.Zero é uma extensão para o google Chrome que lê o texto selecionado em voz alta.

## Funcionalidades
- Leitura em voz alta do texto selecionado na página.
- Suporte a múltiplos idiomas, incluindo:
    - Português (Brasil)
    - Inglês (EUA)
    - Espanhol (Espanha)
- Controle de velocidade e volume de fala.
- Escolha entre diferentes vozes (se disponíveis no sistema)
- Opção de tema claro ou escuro para a interface de configurações
- Fácil acesso às configurações para personalizar

## Como usar
1. Instale a extensão no seu navegador Chrome.
2. Selecione o texto que deseja ouvir.
3. Clique no ícone da extensão e pressione "Ler Texto" para iniciar a leitura.
4. Pressione "Parar" para interromper a leitrua a qualquer momento.
5. Acesse as configurações da extensão clicando no ìcone de engrenagem, onde você pode ajustar o idioma, velocidade, volume e voz.

## Instalação
1. Faça o download ou clone este repositório:
```bash
git clone https://github.com/Zer0G0ld/Text.Readeer.Zer0
```
2. Abra o Google Chrome e vá para `chrome://extensions/`
3. Ative o *Modo de desenvolvedor* no canto superior direito.
4. Clique em *Carregar sem compactação* e selecione a pasta da extensão.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues, sugerir novas funcionalidades ou enviar pull requests.

## Licença
Este projeto está licenciado sob os termos da *GNU General Public License v3.0*.
Para mais informações, consulte o arquivo [LICENSE](https://github.com/Zer0G0ld/Text.Readeer.Zer0/blob/main/LICENSE) incluído neste repositório.


---

### **1. Prioridade Alta (Funcionalidades Essenciais)**

Essas são as partes que garantem que a extensão funcione minimamente.  

#### **1.1. Arquivo `manifest.json`**
- Configurar as permissões básicas, scripts e estrutura da extensão.
- **Importância**: A extensão não funcionará sem este arquivo.  

#### **1.2. Arquivo `popup.html`**
- Criar a interface básica com:
  - Botões: **Ler** e **Parar**.
  - Botão de configurações (não precisa ser funcional de imediato).  

#### **1.3. Arquivo `popup.js`**
- Implementar o envio de mensagens ao script de conteúdo para:
  - **Iniciar a leitura**.
  - **Parar a leitura**.  

#### **1.4. Arquivo `contentScript.js`**
- Injetar o script na página.
- Capturar o texto selecionado e usar a API `SpeechSynthesis` para lê-lo.
- Implementar a funcionalidade de parar a leitura.  

---

### **2. Prioridade Média (Melhorias no Controle e Configuração)**

Essas funcionalidades tornam a extensão mais personalizável e flexível para o usuário.  

#### **2.1. Página de Configurações (`configPlugin/options.html`)**
- Permitir que o usuário:
  - Ajuste a velocidade da fala.
  - Ajuste o volume.
  - Escolha o idioma e a voz.
- Salvar essas configurações no `chrome.storage.sync`.  

#### **2.2. Conectar o Popup às Configurações**
- Usar configurações salvas para ajustar a leitura.  

#### **2.3. Menu de Contexto**
- Criar uma opção "Ler Texto Selecionado" no menu de contexto.  

---

### **3. Prioridade Baixa (Polimento e Localização)**

Essas são as melhorias que enriquecem a experiência do usuário.  

#### **3.1. Suporte a múltiplos idiomas (`_locales`)**
- Adicionar mensagens traduzidas no arquivo `messages.json` (Português, Inglês e Espanhol).  

#### **3.2. Estilização aprimorada**
- Ajustar o layout do popup e da página de configurações para torná-los mais atraentes.  

#### **3.3. Otimizações**
- Melhorar a performance e corrigir bugs.  

---

### **Como Começamos?**
Podemos começar com a **Prioridade Alta**. Sugiro a seguinte ordem:  
1. Criar o **manifest.json**.  
2. Desenvolver o **popup.html** e o **popup.js**.  
3. Implementar o básico no **contentScript.js**.  
