import { parseGIF, decompressFrames } from 'https://cdn.jsdelivr.net/npm/gifuct-js@2.1.2/+esm';
const asciibox = {
    container: document.querySelector(".asciibox"),
    width: 0,
    height: 0,
    scale_nums: 3,
    texts: [],
    current_text_index: 0,
    init() {
        fetch("./ascii.gif")
            .then((resp) => resp.arrayBuffer())
            .then((buff) => {
                const gif = parseGIF(buff);
                this.width = gif.lsd.width;
                this.height = gif.lsd.height;
                decompressFrames(gif, true).forEach(frame => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = frame.dims.width;
                    canvas.height = frame.dims.height;
                    const image_data = new ImageData(
                        frame.patch,
                        frame.dims.width,
                        frame.dims.height
                    );
                    ctx.putImageData(image_data, 0, 0);
                    //document.body.appendChild(canvas)
                    this.create_texts(ctx.getImageData(0, 0, this.width, this.height).data);
                });
                setInterval(() => {
                    this.current_text_index = (this.current_text_index + 1) % (this.texts.length - 1);
                    this.container.innerText = this.texts[this.current_text_index];
                }, 150);
            });
    },
    create_texts(data) {
        let text = "";
        const levels = [["0", "1"], ["."], [" "]];
        for (let y = 0; y < this.height; y += this.scale_nums) {
            let row = "";
            for (let x = 0; x < this.width; x += this.scale_nums) {
                const i = (y * this.width + x) * 4;
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                if (avg > 253) {
                    row += " ";
                } else {
                    const level = levels[Math.floor(avg / 255 * (levels.length - 1))];
                    const char = level[parseInt(Math.random() * level.length)];
                    row += char;
                }
            }
            text += row + "\n";
        }
        this.texts.push(text);
    }
};
asciibox.init();