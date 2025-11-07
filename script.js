document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.toggle');

    toggleButtons.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleList(this);
        });
    });

    const itemTexts = document.querySelectorAll('.item-text:not(.no-children)');

    itemTexts.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const toggle = this.previousElementSibling;
            if (toggle && toggle.classList.contains('toggle')) {
                toggleList(toggle);
            }
        });
    });
});

function toggleList(toggleElement) {
    const parentLi = toggleElement.parentElement;
    const nestedUl = parentLi.querySelector('.nested');

    if (!nestedUl) {
        return;
    }

    const isExpanded = nestedUl.classList.contains('active');

    if (isExpanded) {
        nestedUl.classList.remove('active');
        toggleElement.classList.remove('expanded');
    } else {
        nestedUl.classList.add('active');
        toggleElement.classList.add('expanded');
    }
}

function expandAll() {
    const allNested = document.querySelectorAll('.nested');
    const allToggles = document.querySelectorAll('.toggle');

    allNested.forEach(ul => ul.classList.add('active'));
    allToggles.forEach(toggle => toggle.classList.add('expanded'));
}

function collapseAll() {
    const allNested = document.querySelectorAll('.nested');
    const allToggles = document.querySelectorAll('.toggle');

    allNested.forEach(ul => ul.classList.remove('active'));
    allToggles.forEach(toggle => toggle.classList.remove('expanded'));
}
