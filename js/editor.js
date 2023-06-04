document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.querySelector("button[data-func='save']");
    const visJsonButton = document.querySelector("button[data-func='vis-json']");

    saveButton.addEventListener("click", function () {
        const content = document.querySelector(".editor").innerHTML;
        localStorage.setItem("wysiwyg", content);

        const savedIndicator = document.createElement("span");
        savedIndicator.classList.add("saved");
        savedIndicator.innerHTML = '<i class="fa fa-check"></i>';

        document.querySelector(".editor").appendChild(savedIndicator);

        setTimeout(function () {
            savedIndicator.style.opacity = 0;
            savedIndicator.addEventListener("transitionend", function () {
                savedIndicator.remove();
            }, { once: true });
        }, 1000);
    });


    if (typeof Storage !== "undefined") {
        const storedContent = localStorage.getItem("wysiwyg");
        if (storedContent) {
            document.querySelector(".editor").innerHTML = storedContent;
        }

        document.querySelector(".editor").addEventListener("keypress", function () {
            const savedIndicator = document.querySelector(".editor .saved");
            if (savedIndicator) {
                savedIndicator.remove();
            }
        });
    }


    visJsonButton.addEventListener("click", function () {
        const title = document.querySelector(".title-input").value;
        const subtitle = document.querySelector(".subtitle-input").value;
        const image = document.querySelector(".image-input").value;
        const imageCredit = document.querySelector(".image-credits-input").value;
        const imageDescription = document.querySelector(".image-description-input").value;
        const content = document.querySelector(".editor").innerHTML;

        const article = {
            title: title,
            subtitle: subtitle,
            image: image,
            imageCredit: imageCredit,
            imageDescription: imageDescription,
            datetime: new Date().toISOString(),
            content: content,
        };

        const json = JSON.stringify(article, null, 2);

        // Create a Blob with the JSON data
        const blob = new Blob([json], { type: "application/json" });

        // Create a temporary anchor element
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${title}.json`;
        a.click();

        // Clean up
        URL.revokeObjectURL(a.href);
    });

    function execCommand(command, value = null) {
        document.execCommand(command, false, value);
    }

    const toolbarButtons = document.querySelectorAll(".toolbar button");
    toolbarButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const func = button.getAttribute("data-func");
            execCommand(func);
        });
    });

    const formatSelect = document.querySelector(".customSelect select");
    formatSelect.addEventListener("change", function () {
        const func = formatSelect.getAttribute("data-func");
        const value = formatSelect.options[formatSelect.selectedIndex].value;
        execCommand(func, value);
    });

    // Event handler for input event on the editor
    document.querySelector(".editor").addEventListener("input", function () {
        updateFormatSelector();
    });

    // Event handlers for mouseup and keyup events on the editor
    const editor = document.querySelector(".editor");
    editor.addEventListener("mouseup", function () {
        updateFormatSelector();
    });
    editor.addEventListener("keyup", function () {
        updateFormatSelector();
    });

    // Function to update the format selector based on the current selection
    function updateFormatSelector() {
        const formatSelect = document.querySelector(".customSelect select");
        const selectedFormat = document.queryCommandValue("formatBlock");
        formatSelect.value = selectedFormat;
    }
    const downloadArticleButton = document.createElement("button");
    downloadArticleButton.textContent = "Last ned artikkel";
    downloadArticleButton.classList.add("btn", "btn-primary", "ms-3");
    downloadArticleButton.style.fontSize = "12px"; // Adjust the font size here
    downloadArticleButton.style.borderRadius = "0";
    downloadArticleButton.style.padding = "8px 16px";

    downloadArticleButton.addEventListener("click", function () {
        const title = document.querySelector(".title-input").value;
        const subtitle = document.querySelector(".subtitle-input").value;
        const image = document.querySelector(".image-input").value;
        const imageCredit = document.querySelector(".image-credits-input").value;
        const imageDescription = document.querySelector(".image-description-input").value;
        const datetime = new Date().toLocaleString("no-NO", {
            dateStyle: "long",
            timeStyle: "short",
        });
        const content = document.querySelector(".editor").innerHTML;

        const template = `<!DOCTYPE html>
        <html lang="no">
        <head>
            <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="../css/styles.css">
                <link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.css">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="../fontawesome-free-6.4.0-web/css/all.min.css">
                <link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.min.css">
                <script src="../js/jquery-3.7.0.min.js"></script>
                <script src="../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
                <link rel="apple-touch-icon" sizes="180x180" href="../favicons/apple-touch-icon.png">
                <link rel="icon" type="image/png" sizes="32x32" href="../favicons/favicon-32x32.png">
                <link rel="icon" type="image/png" sizes="16x16" href="../favicons/favicon-16x16.png">
                <link rel="manifest" href="../favicons/site.webmanifest">
                <script src="../js/script.js"></script>
                <link rel="stylesheet" href="../css/article.css">
                <title>${title} - Partiet</title>
        </head>
        <body>
            <header>
                <div id="navbar-placeholder"></div>
            </header>
            <main>
                <article>
                    <div class="article-content">
                        <h1 class="fw-bolder">${title}</h1>
                        <h2 class="me-md-0">${subtitle}</h2>
                        <div class="article-image">
                            <img src="${image}" alt="Article Image">
                            <p class="image-description">${imageDescription} <span class="text-light-emphasis"> Foto: ${imageCredit}</span></p>
                        </div>
                        <div class="article-text">
                            ${content}
                        </div>
                    </div>
                    <aside class="author-info">
                        <div class="author-image">
                                <img src="../images/fører_ikon.jpg" alt="Forfatter bilde">
                            </div>
                            <div class="author-name">
                                <p>Nathaniel Bryne</p>
                            </div>
                            <div class="author-desc">
                                <p class="fst-italic">Partifører</p>
                            </div>
                            <div class="publish-time">
                                <p><span class="fw-bold">Publisert: </span class="datetime">${datetime}</p>
                            </div>
                            <div class="share-buttons">
                                <a href="#" target="_blank"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" target="_blank"><i class="fab fa-twitter"></i></a>
                                <a href="mailto:?subject=Check%20out%20this%20article&body=I thought you might find this article interesting: [Insert article URL here]"
                                    target="_blank"><i class="fas fa-envelope"></i></a>
                            </div>
                    </aside>
                </article>
            </main>
            <footer>
                <div id="footer-placeholder"></div>
            </footer>
        </body>
        </html>`;

        const blob = new Blob([template], { type: "text/html" });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${title}.html`;
        a.click();

        URL.revokeObjectURL(a.href);
    });

    visJsonButton.insertAdjacentElement("afterend", downloadArticleButton);

    // Handle the paste event
    editor.addEventListener("paste", function (event) {
        event.preventDefault(); // Prevent the default paste behavior

        // Get the pasted text
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData("text/plain");

        // Insert the pasted text as plain text
        insertPlainText(pastedText);
    });

    // Function to insert plain text into the editor
    function insertPlainText(text) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
    }

});
