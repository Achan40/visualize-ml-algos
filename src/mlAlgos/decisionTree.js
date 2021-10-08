// Calcuate gini index for a split dataset
function giniIndex(groups, classes) {
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

// Split a dataset based on an attribute and an attribute value
function testSplit(index, value, dataset) {
    let left = [];
    let right = [];
    for (let row = 0; row < dataset.length; row++) {
        if (dataset[row][index] < value) {
            left.push(dataset[row]);
            
        } else {
            right.push(dataset[row]);
        }
    }
    console.log(left,right)
    return [left, right];
}

export function getSplit(dataset) {
    let cv = dataset.map(function (row) {
        return row[row.length-1];
    })
    let class_values = Array.from(new Set(cv));
    let b_index = 999;
    let b_value = 999;
    let b_score = 999;
    let b_groups = null;

    for (let index = 0; index < dataset[0].length; index++) {
        for (let row = 0; row < dataset.length; row++) {
            let groups = testSplit(index, dataset[row][index], dataset);
            let gini = giniIndex(groups, class_values);
            if (gini < b_score) {
                b_index = index;
                b_value = dataset[row][index];
                b_score = gini;
                b_groups = groups;
            }
        } 
    }
    return {'index':b_index, 'value':b_value, 'groups':b_groups};
}

// helper function to sum up values in an array
function addArr(arr) {
    return arr.reduce((a, b) => a + b,0);
}