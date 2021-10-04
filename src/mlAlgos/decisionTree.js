// Calcuate gini index for a split dataset
export function giniIndex(groups, classes) {
    // Count all samples at a split point
    let n_instances = groups.map(function (curr) {
        return curr.length;
    });
    n_instances = parseFloat(addArr(n_instances))

    // Sum weighted gini index for each group
    let gini = 0.0
    for (const group of groups) {
        let size = parseFloat(group.length);
        // avoid division by zero
        if (size === 0) {
            continue;
        }
        let score = 0.0;
        // score the group based on the score for each class
        classes.forEach(class_val => {
            let p = group.map(function (row) {
                return row[group.length - 1];
            });
            p = p.filter(x => x===class_val).length/size;
            score += p * p;
        });
        // weight the group score by its relative size
        gini += (1.0 - score) * (size / n_instances);
    };
    return gini;
}

// helper function to sum up values in an array
function addArr(arr) {
    return arr.reduce((a, b) => a + b,0);
}