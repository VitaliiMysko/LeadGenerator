import { addKeywords } from "../../utils/open-jobs.js";

// Free-text tags: Enter, a comma or leaving the field adds what was typed,
// × or Backspace in the empty field removes a tag.
export function initTagInput({ container, tags, onChange }) {
  const input = container.querySelector(".multi-input");
  const tagsContainer = container.querySelector(".tags-container");

  let current = [...tags];

  container.addEventListener("click", () => input.focus());

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitInput();
    } else if (e.key === "Backspace" && input.value === "" && current.length > 0) {
      update(current.slice(0, -1));
    }
  });

  input.addEventListener("blur", commitInput);

  function commitInput() {
    if (!input.value) return;
    const updated = addKeywords(current, input.value);
    input.value = "";
    if (updated.length !== current.length) update(updated);
  }

  function update(updated) {
    current = updated;
    render();
    onChange([...current]);
  }

  function render() {
    tagsContainer.innerHTML = "";

    current.forEach((value) => {
      const tag = document.createElement("div");
      tag.className = "tag";
      tag.textContent = value;

      const remove = document.createElement("span");
      remove.className = "tag-remove";
      remove.textContent = "×";
      remove.addEventListener("click", (e) => {
        e.stopPropagation();
        update(current.filter((tagValue) => tagValue !== value));
      });

      tag.appendChild(remove);
      tagsContainer.appendChild(tag);
    });
  }

  render();
}
