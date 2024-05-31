export const parseForm = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {};
    for (var x=0, y=form.elements.length; x < y; x++) {
        var field = form.elements[x];
        if (field.name  && field.type != "submit") {
            data[field.name] = field.value;
        }
    }
    return data;
}