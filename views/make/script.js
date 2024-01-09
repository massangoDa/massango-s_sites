document.addEventListener('DOMContentLoaded', function () {
    const editor = document.getElementById('editor');
    const saveAllBtn = document.getElementById('saveAllBtn');
    const displayArea = document.querySelector('.display-area');
    const displayContent = document.querySelector('.displayContent');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
  
    const sections = [];
  
    // 全て保存ボタンがクリックされたとき
    saveAllBtn.addEventListener('click', function () {
      displayAllSections();
    });
  
    // ダウンロードボタンがクリックされたとき
    downloadAllBtn.addEventListener('click', function () {
      downloadAllSections();
    });
  
    // テキストボックスの追加
    function addTextBox(isH2Section) {
      const section = createSection();
      editor.appendChild(section);
      sections.push(section);
    }
  
    // セクションの作成
    function createSection() {
      const section = document.createElement('div');
      section.classList.add('editor-section');
  
      const contentTextarea = document.createElement('textarea');
      contentTextarea.classList.add('editor-content');
      contentTextarea.placeholder = 'Content';
  
      section.appendChild(contentTextarea);
  
      return section;
    }
  
    // 全てのセクションを表示
    function displayAllSections() {
      let combinedContent = '';
  
      sections.forEach((section, index) => {
        const content = section.querySelector('.editor-content').value;
        const element = index === 0 ? 'h2' : 'p';
  
        combinedContent += `<${element}>${content}</${element}>\n`;
      });
  
      displayContent.innerHTML = combinedContent;
      displayArea.style.display = 'block';
      downloadAllBtn.style.display = 'block';
    }
  
    // ダウンロードボタンがクリックされたとき
    function downloadAllSections() {
      let combinedHTML = '';
  
      sections.forEach((section, index) => {
        const content = section.querySelector('.editor-content').value;
        const element = index === 0 ? 'h2' : 'p';
  
        const htmlContent = generateHTML(content, element);
        combinedHTML += htmlContent;
      });
  
      downloadFile(combinedHTML, 'all_blog_posts.html', 'text/html');
    }
  
    // HTML生成関数
    function generateHTML(content, element) {
      return `<${element}>${content}</${element}>\n`;
    }
  
    // ファイルダウンロード関数
    function downloadFile(content, fileName, fileType) {
      const blob = new Blob([content], { type: fileType });
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  
    // セクション（h2）を追加
    addTextBox(true);
    // セクション（p）を追加
    addTextBox(false);
  });
  