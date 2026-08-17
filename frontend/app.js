/*
 * HC Sniffer
 *
 * Frontend:
 * GitHub Pages
 */

const API_URL =
    "https://green-boat-901e.sabar-41c.workers.dev/decrypt";


const fileInput =
    document.getElementById("fileInput");

const dropZone =
    document.getElementById("dropZone");

const fileName =
    document.getElementById("fileName");

const fileInfo =
    document.getElementById("fileInfo");

const sniffButton =
    document.getElementById("sniffButton");

const clearButton =
    document.getElementById("clearButton");

const copyButton =
    document.getElementById("copyButton");

const statusElement =
    document.getElementById("status");

const resultSection =
    document.getElementById("resultSection");

const output =
    document.getElementById("output");


let selectedFile = null;


/*
 * STATUS
 */

function setStatus(message, type = "") {

    statusElement.textContent = message;

    statusElement.className =
        "status " + type;
}


/*
 * SELECT FILE
 */

function selectFile(file) {

    if (!file) {
        return;
    }


    const fileNameLower =
        file.name.toLowerCase();


    if (!fileNameLower.endsWith(".hc")) {

        selectedFile = null;

        sniffButton.disabled = true;

        setStatus(
            "File harus memiliki ekstensi .hc",
            "error"
        );

        return;
    }


    /*
     * Maximum 2 MB
     */

    const MAX_SIZE =
        2 * 1024 * 1024;


    if (file.size > MAX_SIZE) {

        selectedFile = null;

        sniffButton.disabled = true;

        setStatus(
            "Ukuran file maksimum 2 MB.",
            "error"
        );

        return;
    }


    selectedFile = file;


    fileName.textContent =
        file.name;


    fileInfo.textContent =
        `${(file.size / 1024).toFixed(1)} KB`;


    sniffButton.disabled = false;


    setStatus(
        "File siap diproses."
    );
}


/*
 * FILE INPUT
 */

fileInput.addEventListener(
    "change",
    function () {

        selectFile(
            fileInput.files[0]
        );

    }
);


/*
 * DRAG ENTER
 */

[
    "dragenter",
    "dragover"
].forEach(eventName => {

    dropZone.addEventListener(
        eventName,
        event => {

            event.preventDefault();

            dropZone.classList.add(
                "dragging"
            );

        }
    );

});


/*
 * DRAG LEAVE
 */

[
    "dragleave",
    "drop"
].forEach(eventName => {

    dropZone.addEventListener(
        eventName,
        event => {

            event.preventDefault();

            dropZone.classList.remove(
                "dragging"
            );

        }
    );

});


/*
 * DROP
 */

dropZone.addEventListener(
    "drop",
    event => {

        const files =
            event.dataTransfer.files;

        if (!files.length) {
            return;
        }

        selectFile(files[0]);

    }
);


/*
 * SNIFF
 */

sniffButton.addEventListener(
    "click",
    async function () {

        if (!selectedFile) {
            return;
        }


        sniffButton.disabled = true;


        resultSection.hidden = true;

        output.value = "";


        setStatus(
            "Decrypting..."
        );


        try {

            const formData =
                new FormData();


            formData.append(
                "file",
                selectedFile,
                selectedFile.name
            );


            console.log("Uploading to:", API_URL);

const response = await fetch(
    API_URL,
    {
        method: "POST",
        body: formData
    }
);

console.log("Worker response:", response.status);


            let data;


            try {

                data =
                    await response.json();

            } catch {

                throw new Error(
                    "Response server tidak valid."
                );

            }


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    `Server error: ${response.status}`
                );

            }


            output.value =
                data.text || "";


            resultSection.hidden = false;


            setStatus(
    "Berhasil decrypt.",
    "success"
);


        } catch (error) {

            console.error(error);


            setStatus(
                error.message ||
                "Decrypt gagal.",
                "error"
            );

        } finally {

            sniffButton.disabled =
                !selectedFile;

        }

    }
);


/*
 * COPY
 */

copyButton.addEventListener(
    "click",
    async function () {

        if (!output.value) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                output.value
            );


            const oldText =
                copyButton.textContent;


            copyButton.textContent =
                "COPIED";


            setTimeout(
                () => {

                    copyButton.textContent =
                        oldText;

                },
                1200
            );


        } catch {

            output.select();

            document.execCommand(
                "copy"
            );

        }

    }
);


/*
 * CLEAR
 */

clearButton.addEventListener(
    "click",
    function () {

        selectedFile = null;


        fileInput.value = "";


        fileName.textContent =
            "Pilih file .hc";


        fileInfo.textContent =
            "atau drag & drop ke sini";


        sniffButton.disabled =
            true;


        output.value = "";


        resultSection.hidden =
            true;


        setStatus("");

    }
);
