---
pagetitle: YAMLテスト
title: YAML メタデータテスト
subtitle: サブタイトル
author:
  - Foo
  - Bar
---

# foo

this is a markdown file
with a code block

## Image

![foo](./test.png)

## Table

| テーブル   | ヘッダ |
| ---------- | ------ |
| コンテンツ | ウェー |

## Programming Code

### Block

```js
#!/usr/bin/env node
'use strict';

var pdc = require('pandoc-filter');

function mermaid(typ, val) {
  if (typ !== 'CodeBlock') {
    return null;
  }

  var cls = val[0][1];
  if (0 > cls.indexOf('mermaid')) {
    return null;
  }

  var cnt = val[1];
  return pdc.Div(
    ['', [], []],
    [
      pdc.RawBlock('html', '<!-- htmlmin:ignore -->'),
      pdc.Div(['', ['mermaid'], []], [pdc.Plain([pdc.Str(cnt)])]),
      pdc.RawBlock('html', '<!-- htmlmin:ignore -->'),
    ],
  );
}

pdc.toJSONFilter(mermaid);
```

```html
<div>
  <!-- htmlmin:ignore -->
  <div class="mermaid">graph TD; A--&gt;B; A--&gt;C; B--&gt;D; C--&gt;D;</div>
  <!-- htmlmin:ignore -->
</div>

<link rel="stylesheet" href="css/mermaid.min.css" />
<script src="js/mermaid.min.js"></script>
<script>
  mermaid.initialize({ startOnLoad: true });
</script>
```

```javascript
import {x, y} as p from 'point';
const ANSWER = 42;

class Car extends Vehicle {
  constructor(speed, cost) {
    super(speed);

    var c = Symbol('cost');
    this[c] = cost;

    this.intro = `This is a car runs at
      ${speed}.`;
  }
}

for (let num of [1, 2, 3]) {
  console.log(num + 0b111110111);
}

function $initHighlight(block, flags) {
  try {
    if (block.className.search(/\bno\-highlight\b/) != -1)
      return processBlock(block.function, true, 0x0F) + ' class=""';
  } catch (e) {
    /* handle exception */
    var e4x =
        <div>Example
            <p>1234</p></div>;
  }
  for (var i = 0 / 2; i < classes.length; i++) { // "0 / 2" should not be parsed as regexp
    if (checkCondition(classes[i]) === undefined)
      return /\d+[\s/]/g;
  }
  console.log(Array.every(classes, Boolean));
}

export  $initHighlight;
```

### Inline

`<$>`{.haskell}

`std::printf("%s\n", "Hello, World!");`{.cpp}

## mermaid

### Flow

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

### sequence

```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->John: Hello John, how are you?
    loop Healthcheck
        John->John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->Alice: Great!
    John->Bob: How about you?
    Bob-->John: Jolly good!
```

### Gantt

```mermaid
gantt
        dateFormat  YYYY-MM-DD
        title Adding GANTT diagram functionality to mermaid

        section A section
        Completed task                      : done,    des1, 2014-01-06,2014-01-08
        Active task                         : active,  des2, 2014-01-09, 3d
        Future task                         :          des3, after des2, 5d
        Future task2                        :          des4, after des3, 5d

        section Critical tasks
        Completed task in the critical line : crit, done, 2014-01-06,24h
        Implement parser and jison          : crit, done, after des1, 2d
        Create tests for parser             : crit, active, 3d
        Future task in critical line        : crit, 5d
        Create tests for renderer           : 2d
        Add to mermaid                      : 1d

        section Documentation
        Describe gantt syntax               : active, a1, after des1, 3d
        Add gantt diagram to demo page      : after a1  , 20h
        Add another diagram to demo page    : doc1, after a1  , 48h

        section Last section
        Describe gantt syntax               : after doc1, 3d
        Add gantt diagram to demo page      : 20h
        Add another diagram to demo page    : 48h
```

# Other

## Font Awesome

```mermaid
graph TD
    B["fa:fa-twitter for peace"]
    B-->C[fa:fa-ban forbidden]
    B-->D(fa:fa-spinner);
    B-->E(A fa:fa-camera-retro perhaps?);
```

```mermaid
graph LR
    A-->B
    B-->C
    C-->A
    D-->C
```

```mermaid
graph TB
    subgraph one
    a1-->a2
    end
    subgraph two
    b1-->b2
    end
    subgraph three
    c1-->c2
    end
    c1-->a2
```

```mermaid
graph LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
```

```mermaid
sequenceDiagram
    Alice->>Bob: Hello Bob, how are you?
    alt is sick
        Bob->>Alice: Not so good :(
    else is well
        Bob->>Alice: Feeling fresh like a daisy
    end
    opt Extra response
        Bob->>Alice: Thanks for asking
    end
```

```mermaid
gantt
    title A Gantt Diagram

    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2014-01-12, 12d
    anther task      :24d
```
