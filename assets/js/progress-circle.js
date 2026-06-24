document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    const width = height = 44;
    const radius = 20;
    const cx = width / 2;
    const cy = height / 2;
    const strokeWidth = 4;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "progress-circle");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", radius);
    circle.setAttribute("stroke-width", strokeWidth);
    circle.setAttribute("fill", "none");

    svg.appendChild(circle);
    btn.appendChild(svg);

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollFraction = docHeight > 0 ? window.scrollY / docHeight : 0;
            const circumference = 2 * Math.PI * radius;

            circle.style.strokeDashoffset = circumference * (1 - scrollFraction);
        }
    });
});