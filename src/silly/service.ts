function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function mixClr(a: number, b: number, mix: number) {
  return Math.floor(a * mix + b * (1 - mix));
}

export class SillyService {
  static getRandomColors() {
    const colors = {
      bg: "",
      cloud: "",
      cloudOutline: "",
    };

    const baseH = Math.floor(Math.random() * 360);
    const baseS = Math.floor(Math.random() * 80 + 15);
    const baseL = Math.floor(Math.random() * 10 + 55);

    const outlineDiff = Math.floor(Math.random() * 5 + 20);

    colors.cloud = hslToHex(baseH, baseS, baseL);
    colors.cloudOutline = hslToHex(
      baseH,
      baseS,
      Math.min(
        baseL + (Math.random() <= 0.6 ? outlineDiff / 2 : -outlineDiff),
        100,
      ),
    );

    const bgHDiff = Math.floor(Math.random() * 45 + 30);
    const bgH =
      Math.abs(baseH + (Math.random() <= 0.6 ? bgHDiff / 2 : -bgHDiff)) % 360;
    const bgS = Math.min(
      mixClr(Math.floor(Math.random() * 80 + 15), baseS, 0.9),
      100,
    );
    const bgL = Math.min(
      mixClr(Math.floor(Math.random() * 10 + 55), baseL, 0.9),
      100,
    );

    colors.bg = hslToHex(bgH, bgS, bgL);

    return colors;
  }

  static getIcon() {
    return `<svg width="1024" height="1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#00FF00" d="M0 0h1024v1024H0z"/><path d="m511.5 42 105.982 178.317 195.807-68.475-33.434 204.723 194.012 73.407-157.205 135.336L918.099 746.25l-207.418 2.624-38.603 203.812L511.5 821.37 350.922 952.686l-38.603-203.812-207.418-2.624 101.437-180.942L49.133 429.972l194.012-73.407-33.434-204.723 195.807 68.475L511.5 42Z" fill="#0000FF"/><path d="M511.732 610.416c19.726 0 36.668-6.94 50.827-20.821 14.158-13.882 21.238-30.834 21.238-50.857V379.454h82.297v-50.441H554.595v152.648c-5.873-4.129-12.612-7.3-20.216-9.512-7.605-2.213-15.242-3.319-22.911-3.319-19.571 0-36.007 6.797-49.307 20.391-13.3 13.593-19.95 30.112-19.95 49.555 0 19.738 6.655 36.613 19.966 50.623 13.311 14.012 29.83 21.017 49.555 21.017Zm-138.988 91.589c-15.11 0-28.179-5.561-39.207-16.683-11.028-11.122-16.542-24.144-16.542-39.066V288.75c0-14.922 5.514-27.944 16.542-39.066C344.565 238.561 357.634 233 372.744 233H730.25c14.922 0 27.944 5.561 39.066 16.684C780.439 260.806 786 273.828 786 288.75v357.506c0 14.922-5.561 27.944-16.684 39.066-11.122 11.122-24.144 16.683-39.066 16.683H372.744ZM272.749 802c-15.11 0-28.178-5.561-39.207-16.684C222.514 774.194 217 761.172 217 746.25V332.995h55.749V746.25h413.256V802H272.749Z" fill="#FF0000"/></svg>`;
  }

  static getBanner() {
    return `<svg width="4080" height="1440" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#00FF00" d="M0 0h4080v1440H0z"/><path d="M513 741c188.881 0 342-153.119 342-342S701.881 57 513 57 171 210.119 171 399s153.119 342 342 342ZM1909 624c0 162.924-132.08 295-295 295s-295-132.076-295-295 132.08-295 295-295 295 132.076 295 295ZM1077 1188.5c0 93.06-75.44 168.5-168.5 168.5S740 1281.56 740 1188.5 815.44 1020 908.5 1020s168.5 75.44 168.5 168.5ZM2790 1064.5c0 143.87-116.63 260.5-260.5 260.5S2269 1208.37 2269 1064.5 2385.63 804 2529.5 804 2790 920.63 2790 1064.5ZM3342.5 836c164.3 0 297.5-133.195 297.5-297.5S3506.8 241 3342.5 241 3045 374.195 3045 538.5 3178.2 836 3342.5 836ZM3820 1249c0 59.65-48.35 108-108 108s-108-48.35-108-108 48.35-108 108-108 108 48.35 108 108ZM2448.5 329c45.01 0 81.5-36.489 81.5-81.5s-36.49-81.5-81.5-81.5-81.5 36.489-81.5 81.5 36.49 81.5 81.5 81.5Z" fill="#0000FF"/><path d="M400.26 807H267.74c-70.457 0-96.74 26.311-96.74 96.841v265.319c0 70.53 26.283 96.84 96.74 96.84h132.52c70.457 0 96.74-26.31 96.74-96.84V903.841c0-70.53-26.283-96.841-96.74-96.841ZM334 903.841c18.332 0 33.13 14.814 33.13 33.165s-14.798 33.165-33.13 33.165-33.13-14.814-33.13-33.165 14.798-33.165 33.13-33.165Zm0 265.319c-36.664 0-66.26-29.63-66.26-66.33s29.596-66.33 66.26-66.33 66.26 29.63 66.26 66.33-29.596 66.33-66.26 66.33Z" fill="#FF0000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2382 447.958c0-42.687 34.7-77.291 77.5-77.291s77.5 34.604 77.5 77.291-34.7 77.292-77.5 77.292-77.5-34.605-77.5-77.292Zm77.5-46.375c-25.68 0-46.5 20.763-46.5 46.375 0 25.613 20.82 46.375 46.5 46.375s46.5-20.762 46.5-46.375c0-25.612-20.82-46.375-46.5-46.375Z" fill="#FF0000"/><path d="M2459.5 308.833c-8.56 0-15.5 6.921-15.5 15.459 0 8.537 6.94 15.458 15.5 15.458h.16c8.56 0 15.5-6.921 15.5-15.458 0-8.538-6.94-15.459-15.5-15.459h-.16Z" fill="#FF0000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2320 293.375c0-25.612 20.82-46.375 46.5-46.375h186c25.68 0 46.5 20.763 46.5 46.375v247.333c0 25.613-20.82 46.375-46.5 46.375h-186c-25.68 0-46.5-20.762-46.5-46.375V293.375Zm46.5-15.458c-8.56 0-15.5 6.921-15.5 15.458v247.333c0 8.538 6.94 15.459 15.5 15.459h186c8.56 0 15.5-6.921 15.5-15.459V293.375c0-8.537-6.94-15.458-15.5-15.458h-186ZM1377.81 917.355a22.769 22.769 0 0 1 6.77 17.948l-21.97 295.587c-3.73 50.23-47.57 87.91-97.91 84.17-50.34-3.74-88.12-47.49-84.39-97.72 3.74-50.23 47.57-87.92 97.91-84.18 16.61 1.24 31.84 6.82 44.67 15.56l14.12-189.964-230.69 20.957-20.53 276.327-.01.07c-3.77 50.19-47.59 87.84-97.904 84.1-50.34-3.74-88.121-47.49-84.388-97.72 3.734-50.23 47.569-87.92 97.912-84.18 16.6 1.24 31.84 6.82 44.67 15.56l16.11-216.806c.83-11.115 9.59-20.002 20.71-21.013l276.83-25.148a22.867 22.867 0 0 1 18.09 6.452Zm-60.77 310.145c1.86-25.12-17.03-46.99-42.2-48.86-25.17-1.87-47.08 16.97-48.95 42.08-1.87 25.12 17.02 47 42.19 48.87 25.17 1.87 47.09-16.98 48.96-42.09Zm-319.023-23.71c25.173 1.87 44.063 23.74 42.193 48.86-1.87 25.11-23.78 43.96-48.953 42.09-25.17-1.88-44.061-23.75-42.195-48.87 1.867-25.11 23.785-43.95 48.955-42.08Z" fill="#FF0000"/><path d="M1742 226.367v29.242c0 24.493-9.74 45.487-26.97 57.734-10.74 7.997-23.97 11.746-37.71 11.746-8.49 0-16.98-1.249-25.72-4.249l-134.36-44.737v243.181c0 65.481-53.19 118.716-118.62 118.716S1280 584.765 1280 519.284s53.19-118.716 118.62-118.716c31.47 0 59.94 12.496 81.16 32.49V169.384c0-24.244 9.99-45.238 27.22-57.734 17.24-12.247 40.21-14.996 63.19-7.498l110.38 36.99c33.96 11.246 61.43 49.486 61.43 85.225ZM2896 1009.09v188.72c0 33.07-26.89 59.96-59.97 59.96a60.164 60.164 0 0 1-42.35-17.61 60.148 60.148 0 0 1-17.62-42.35c0-32.9 27.06-59.79 59.97-59.79 14.03 0 26.56 4.84 36.75 12.86v-99.37l-153.84 43.75v134.78a60.13 60.13 0 0 1-17.62 42.35 60.121 60.121 0 0 1-42.35 17.61c-33.08 0-59.97-26.89-59.97-59.96 0-32.9 26.89-59.79 59.97-59.79 13.86 0 26.39 4.85 36.58 12.7v-147.64c0-24.55 14.87-43.593 38.42-49.939l96.55-26.388c19.54-5.344 36.08-3.507 47.77 5.511 11.86 8.852 17.71 23.883 17.71 44.596ZM787.903 209.075c-6.441-6.638-16.24-6.082-21.887 1.243-5.648 7.324-5.005 18.643 1.436 25.281 27.83 28.686 44.828 68.767 47.257 111.43 2.428 42.662-9.912 84.413-34.307 116.072-5.645 7.326-4.999 18.645 1.443 25.281 6.442 6.636 16.241 6.077 21.887-1.25 29.816-38.693 44.898-89.722 41.929-141.866-2.968-52.143-23.744-101.131-57.758-136.191Z" fill="#FF0000"/><path d="M736.863 275.291c-6.44-6.639-16.239-6.082-21.887 1.242-5.647 7.324-5.004 18.643 1.436 25.282 12.369 12.749 19.924 30.563 21.003 49.524 1.08 18.961-4.405 37.517-15.247 51.588-5.645 7.326-5 18.645 1.443 25.281 6.442 6.636 16.241 6.077 21.886-1.25 16.264-21.105 24.49-48.939 22.871-77.381-1.619-28.442-12.951-55.163-31.505-74.286Z" fill="#FF0000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M668.33 229.818c-.392-6.872-4.158-12.942-9.69-15.613-5.531-2.672-11.848-1.472-16.25 3.085l-69.295 71.754-56.477 3.215c-8.547.486-15.02 8.885-14.458 18.758l6.106 107.261c.562 9.873 7.946 17.482 16.494 16.996l56.477-3.215 76.99 63.426c4.89 4.029 11.302 4.503 16.495 1.221 5.193-3.282 8.246-9.74 7.855-16.612L668.33 229.818Zm-78.326 90.203 49.49-51.246 10.013 175.886-54.986-45.298c-2.888-2.38-6.377-3.567-9.891-3.367l-46.429 2.643-4.071-71.507 46.429-2.644c3.515-.2 6.846-1.775 9.445-4.467ZM3333.06 907.882a166.792 166.792 0 0 1 113.43-58.592 166.796 166.796 0 0 1 180.22 152.19l1.75 20.78-41.55 3.5a62.548 62.548 0 0 0-42.53 21.98 62.484 62.484 0 0 0-14.54 45.61l5.25 62.33c1.4 16.53 9.3 31.83 21.97 42.53a62.521 62.521 0 0 0 45.62 14.54l20.77-1.75a62.58 62.58 0 0 0 42.54-21.97 62.594 62.594 0 0 0 14.54-45.62l-12.27-145.429a208.467 208.467 0 0 0-73.24-141.779 208.501 208.501 0 0 0-293.82 24.775 208.473 208.473 0 0 0-48.46 152.043l12.26 145.43a62.62 62.62 0 0 0 21.97 42.54 62.608 62.608 0 0 0 45.62 14.54l20.77-1.76a62.54 62.54 0 0 0 42.54-21.97 62.57 62.57 0 0 0 14.54-45.61l-5.26-62.33a62.536 62.536 0 0 0-21.97-42.53 62.508 62.508 0 0 0-45.62-14.54l-41.55 3.5-1.75-20.77a166.8 166.8 0 0 1 38.77-121.638Zm-33.51 183.958 7 83.11c.47 5.51 3.1 10.61 7.33 14.18a20.84 20.84 0 0 0 15.2 4.84l20.78-1.75c5.51-.46 10.61-3.1 14.18-7.32 3.56-4.23 5.31-9.7 4.84-15.21l-5.25-62.33c-.47-5.51-3.1-10.61-7.33-14.17a20.847 20.847 0 0 0-15.2-4.85l-41.55 3.5Zm332.42-28.03-41.56 3.51c-5.51.46-10.61 3.1-14.17 7.32-3.57 4.23-5.32 9.7-4.85 15.21l5.26 62.32c.46 5.51 3.09 10.61 7.32 14.18 4.22 3.57 9.69 5.31 15.2 4.85l20.78-1.75c5.51-.47 10.61-3.1 14.18-7.33 3.57-4.22 5.31-9.69 4.84-15.2l-7-83.11ZM3069.22 230.76c5.27-5.519 9.29-12.261 11.55-19.618-2.26 7.375-6.29 14.133-11.56 19.664l44.9 2.376-6.04 114.14c-.08 1.495.06 2.962.4 4.375-12.52 5.302-21.36 16.324-22.06 29.518l-4.93 93.175c-.69 12.964 6.67 24.674 18.21 31.332l-3.95 74.539c-.5 9.55 8.06 17.946 18.89 18.519 10.83.573 20.23-6.872 20.73-16.423l3.95-74.538c12.17-5.404 20.72-16.272 21.41-29.236l4.93-93.175c.7-13.194-6.94-25.088-18.82-31.681.48-1.37.78-2.813.86-4.308l6.38-120.535a48.443 48.443 0 0 0 8.77-5.504c9.12-7.226 14.96-17.429 15.56-28.843 1.22-23.061-19.18-43.061-45.33-44.444l-59.43-3.145a54.622 54.622 0 0 0-5.23-5.93c-20.9-20.494-60.82-27.044-95.73 1.943-3.6 3.079-6.58 9.229-6.82 13.887l-2.89 54.508c-.26 4.892 2.54 12.048 6.6 15.532 36.71 32.076 78.33 26.337 99.65 3.872Zm4.51-83.694a51.416 51.416 0 0 1 6.43 11.092 50.24 50.24 0 0 0-6.43-11.092ZM3278.78 199.849c-.6 11.414 4.13 22.176 12.44 30.324a48.055 48.055 0 0 0 8.12 6.391l-18.7 353.481c-.51 9.55 8.05 17.945 18.88 18.518 10.83.573 20.23-6.871 20.74-16.422l18.36-347.079 44.92 2.377c-4.41-5.726-7.59-12.424-9.17-19.536 1.58 7.094 4.76 13.776 9.16 19.489 18.83 24.589 59.62 34.689 99.51 6.666 4.39-3.037 7.93-9.858 8.19-14.749l2.89-54.508c.23-4.426-2.07-11.088-5.33-14.531-31.65-32.509-72.03-30.207-94.98-12.033a54.425 54.425 0 0 0-5.83 5.344l-59.43-3.145c-26.15-1.384-48.55 16.352-49.77 39.413Zm108.94-35.994a50.14 50.14 0 0 0-7.09 9.621 51.182 51.182 0 0 1 7.09-9.621Z" fill="#FF0000"/><path d="M1737.99 1096.52c-.01-.2-.01-.4-.01-.6l1.33-135.187c-.56-64.286 24.02-124.768 69.11-169.868 45.09-44.863 105.17-69.18 169.52-68.549 131.56 1.29 237.6 109.305 236.32 240.7l-.96 97.304c.01.45 0 .91 0 1.36l-.44 44.59c-.49 49.81-41.49 89.96-91.36 89.48l-3.08-.03c-49.87-.49-90.08-41.45-89.59-91.25l.44-44.59c.48-49.81 41.49-89.969 91.36-89.48l3.08.03c20.6.202 39.55 7.308 54.66 19.09l.27-26.853c1.09-111.71-88.96-203.676-201.05-204.775-54.85-.537-105.87 20.073-144.01 58.125-38.37 38.287-59.06 89.557-58.65 144.59l-.24 24.971c15.34-11.492 34.44-18.231 55.04-18.029l3.09.03c49.87.489 90.08 41.441 89.59 91.251l-.44 44.59c-.49 49.8-41.49 89.96-91.36 89.47l-3.08-.03c-49.87-.48-90.08-41.44-89.59-91.25l.05-5.09Z" fill="#FF0000"/></svg>`;
  }

  // https://github.com/Equicord/Equicord/blob/85faac8c3f8b6beea2d2a61134b65ddffa872fd5/src/plugins/fakeProfileThemes/index.tsx#L43-L53
  static getFtpe(primary: string, accent: string) {
    const message = `[${primary},${accent}]`;
    const padding = "";
    const encoded = Array.from(message)
      .map((x) => x.codePointAt(0))
      .filter((x) => x! >= 0x20 && x! <= 0x7f)
      .map((x) => String.fromCodePoint(x! + 0xe0000))
      .join("");

    return (padding || "") + " " + encoded;
  }
}
