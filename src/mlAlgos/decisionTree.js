// helper function to sum up values in an array
function addArr(arr) {
    return arr.reduce((a, b) => a + b,0);
}

// helper function to find the mode of an array, if there is an equal mode, the last is selected
function mode(arr){
    let tmp = arr.slice()
    return tmp.sort((a,b) =>
          tmp.filter(v => v===a).length
        - tmp.filter(v => v===b).length
    ).pop();
}

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
            // basically python list comprehension [row[-1] for row in group]
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
    const left = [], right = [];
    for (let row = 0; row < dataset.length; row++) {
        if (dataset[row][index] < value) {
            left.push(dataset[row]);
        }
        else {
            right.push(dataset[row]);
        }
    }
    return [left, right];
}

// Select the best split point for a dataset
function getSplit(dataset) {
    let cv = dataset.map(function (row) {
        return row[row.length-1];
    })
    let class_values = Array.from(new Set(cv));
    let b_index = 999;
    let b_value = 999;
    let b_score = 999;
    let b_groups = null;

    for (let index = 0; index < dataset[0].length-1; index++) {
        for (let row = 0; row < dataset.length; row++) {
            let groups = testSplit(index, dataset[row][index], dataset);
            let gini = giniIndex(groups, class_values);
            // logging the individual splits
            // console.log('X%d < %.3f Gini=%.3f',index+1,dataset[row][index], gini);
            if (gini < b_score) {
                b_index = index;
                b_value = dataset[row][index];
                b_score = gini;
                b_groups = groups;
            }
        } 
    }
    // logging the best split
    // console.log('Split: [X%d < %.3f]', b_index+1, b_value);
    return {'index':b_index, 'value':b_value, 'groups':b_groups};
}

// Create a terminal node, the most common class value for a group of rows
function toTerminal(group) {
    let outcomes = group.map(function (row){
        return row[row.length-1];
    })
    return mode(outcomes);
}

// Create child splits for a node, or make a terminal
function split(node, max_depth, min_size, depth) {
    let left = node['groups'][0];
    let right = node['groups'][1];
    delete node['groups'];
    // checking for a no split
    if (!left || !left.length || !right || !right.length) {
        node['left'] = node['right'] = toTerminal(left.concat(right));
        return;
    }
    // check for max depth
    if (depth >= max_depth) {
        node['left'] = toTerminal(left);
        node['right'] = toTerminal(right);
        return;
    }
    // process left child
    if (left.length <= min_size) {
        node['left'] = toTerminal(left);
    }
    else {
        node['left'] = getSplit(left);
        split(node['left'], max_depth, min_size, depth+1);
    }
    // process right child
    if (right.length <= min_size) {
        node['right'] = toTerminal(right);
    }
    else {
        node['right'] = getSplit(right);
        split(node['right'], max_depth, min_size, depth+1);
    }
}

// Building the decision tree
export function buildTree(data, max_depth, min_size) {
    let root = getSplit(data);
    split(root, max_depth, min_size, 1);
    return root;
}

// Print the tree
function printTree(node, depth=0) {
    // check if node is a javascript object, (in python: isinstance(node,dict)), then in order traversal
    if (typeof node === 'object' && node !== null) {
        console.log('%s[X%d < %.3f]', ' '.repeat(depth), node['index']+1, node['value']);
        printTree(node['left'], depth++);
        printTree(node['right'], depth++);
    }
    else {
        console.log('%s[%s]', ' '.repeat(depth), node);
    }
}