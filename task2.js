let expBox = document.getElementById("exp");
let resultBox = document.getElementById("result");

let exp = "";

function update() {
    expBox.textContent = exp;

    try {
        if (exp && !isNaN(eval(exp))) {
            resultBox.value = eval(exp);
        } else {
            resultBox.value = "";
        }
    } catch {
        resultBox.value = "";
    }
}

function input(key) {
    if (key === "clear") exp = "";
    else if (key === "delete") exp = exp.slice(0, -1);
    else if (key === "=") {
        try { exp = eval(exp).toString(); }
        catch { exp = "Error"; }
    }
    else exp += key;

    update();
}

document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => input(btn.dataset.key));
});

document.addEventListener("keydown", (e) => {
    let key = e.key;

    if (!isNaN(key) || "+-*/.".includes(key)) input(key);
    else if (key === "Backspace") input("delete");
    else if (key === "Enter") input("=");
    else if (key === "Escape") input("clear");
});
