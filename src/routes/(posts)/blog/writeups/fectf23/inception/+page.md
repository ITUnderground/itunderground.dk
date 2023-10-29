---
title: 'FECTF 2023 Inception writeup'
date: 2023-10-29
length: 8 min
author: Alexander
---

> **Inception**  
> Do you know what the difference between a labyrinth and a maze is?
>
> Labyrinths don't stall the pipeline.  
> [Link to maze.png]

---

<details>
<summary>Table of contents</summary>

- [Looking at the files](#looking-at-the-files)
- [Solving the maze](#solving-the-maze)
  - [Finding a library](#finding-a-library)
  - [Converting the maze](#converting-the-maze)
  - [Maze solving](#maze-solving)
    - [Bugs!](#bugs)
      - [The solution](#the-solution)
  - [Getting the colors](#getting-the-colors)
- [Using the colors](#using-the-colors)
  - [So what's the result?](#so-whats-the-result)
- [Solvescript](#solvescript)

</details>

## Looking at the files

The only thing we get in this challenge is the following 4309x4309 PNG file:

<details>
<summary>Click to expand</summary>

![maze](/media/writeups/fectf23/inception/maze.png)

</details>  
  
Zooming in we see that this image is actually a giant maze!

![Zoomed in](/media/writeups/fectf23/inception/image.png)

The maze has an entrance in the top-left corner, and an exit in the bottom-right corner, along with colors along all the maze paths. We seemingly need to 1. solve the maze, and 2. do something with the colors along the correct path. Let's start with the first of those.

## Solving the maze

### Finding a library

First we're gonna need a pathfinding algorithm. Since we know where the exit is, let's use [A\*](https://en.wikipedia.org/wiki/A*_search_algorithm). After a bit of searching, we find [`python-pathfinding`](https://github.com/brean/python-pathfinding), a library that finds paths in 2d lists. You have a list of 1s and 0s, where 1s represent the open paths:

```py
matrix = [
    [0,1,0,1,0,0],
    [0,1,0,1,0,0],
    [0,1,1,1,1,1],
    [0,1,0,0,0,1],
    [0,1,1,0,1,1],
    [0,1,0,0,1,0],
]
```

The algorithm the finds the path from A to B:

```py
from pathfinding.core.diagonal_movement import DiagonalMovement
from pathfinding.core.grid import Grid
from pathfinding.finder.a_star import AStarFinder

grid = Grid(matrix=matrix)
start = grid.node(1, 0)
end = grid.node(4, 5)

finder = AStarFinder(diagonal_movement=DiagonalMovement.never)
path, runs = finder.find_path(start, end, grid)

print('operations:', runs, 'path length:', len(path))
print(grid.grid_str(path=path, start=start, end=end))

```

```log
operations: 16 path length: 11
+------+
|#s# ##|
|#x# ##|
|#xxxxx|
|# ###x|
|#  #xx|
|# ##e#|
+------+
```

We even get a handy list of coordinates:

```py
>>> path
[GridNode(x=1, y=0, walkable=True, weight=1, grid_id=None, connections=None),
 GridNode(x=1, y=1, walkable=True, weight=1, grid_id=None, connections=None),
 ...
 GridNode(x=4, y=4, walkable=True, weight=1, grid_id=None, connections=None),
 GridNode(x=4, y=5, walkable=True, weight=1, grid_id=None, connections=None)]
```

### Converting the maze

Next up is converting the maze into a 2d list. This is a pretty common operation in Python, and we can do it witl [Pillow](https://python-pillow.org/) and [NumPy](https://numpy.org/):

```py
from PIL import Image
import numpy as np

matrix = np.array(Image.open('maze.png'))
matrix
```

```log
array([[[  0,   0,   0],
        [255, 255, 255],
        [137,  80,  78],
        ...,
        [  0,   0,   0],
        [  0,   0,   0],
        [  0,   0,   0]],
       ...,
       [[  0,   0,   0],
        [  0,   0,   0],
        [  0,   0,   0],
        ...,
        [ 75,  78, 197],
        [255, 255, 255],
        [  0,   0,   0]]], dtype=uint8)
```

This is a 3D array, width $\times$ height $\times$ color. To convert this to the notation used by `python-pathfinding` we need to do some transformation.

```py
flat = np.average(matrix, axis=2) # Flatten the color channel by averaging the R-G-B.
flat[flat == 255] = 0 # Make all white pixels 0s
flat[flat > 0] = 1 # Make all colored pixels 1s
flat = flat.astype(int) # Convert to int
flat[:10, :10] # Print the top left 10x10 corner
```

```log
array([[0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 1, 0, 0, 0, 1, 1, 1, 1],
       [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
       [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
       [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
       [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
       [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
       [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
       [0, 0, 1, 0, 0, 0, 1, 0, 0, 0]])
```

Perfect! Note the line `flat[flat == 255] = 0`. The corridors in the maze are all 3 pixels wide, but we want to get a path that follows the colors. By making all the white pixels black, and all the non-black pixels white we essentially get a mask of only the non-black non-white (color) pixels.  
Almost there!

### Maze solving

Now all we have to do is throw it into the pathfinding library.

```py
grid = Grid(matrix=flat)
start = grid.node(2, 0)
end = grid.node(flat.shape[0] - 3, flat.shape[1] - 1) # Bottom-right corner

finder = AStarFinder(diagonal_movement=DiagonalMovement.never)
path, runs = finder.find_path(start, end, grid)

print('operations:', runs, 'path length:', len(path))
print(grid.grid_str(path=path, start=start, end=end))
```

```log
operations: 3195148 path length: 0
+---------------------------------------------------- ...
...
```

No path huh...

#### Bugs!

Sticking the original maze into an image editor and using the bucket tool on a white pixel fills the entire image, so we know the maze is possible. Exporting our flat array as a black/white image reveals a different story however:

```py
formatted = flat * 255).astype(int)
img = Image.fromarray(formatted)
img.show()
```

![Flood fill gif](/media/writeups/fectf23/inception/bw.gif)  
![Flood fill](/media/writeups/fectf23/inception/image-1.png)  
This tells us that somewhere in our image conversion, we're creating walls that shouldn't be there. After a bit of brainstorming we came to a realisation.

> _Could the path itself include black pixels?_

Turns out the answer is yes, and it can even include white pixels too. These are getting interpreted as walls, and thus blocking our pathfinding.

##### The solution

So we want to mark the black/white pixels that are on the path. We can do so with 2 simple rules:

> **White pixels** are always next to a wall aka. a black pixel. If they aren't, it means they're on the path. Before converting the image, we can therefore check every white pixel, and mark it if we find no black neighbors (8 directions):
>
> ```diff
> flat = np.average(matrix, axis=2)
>
> +pixels_on_path = []
> +for i in range(1, flat.shape[0] - 1):
> +   for j in range(1, flat.shape[1] - 1):
> +       # A white pixel is on the path if all pixels in a 3x3 square around it are NOT black
> +       if flat[i, j] == 255:
> +           if flat[i-1, j-1] > 0 and \\
> +               flat[i-1, j] > 0 and \\
> +               flat[i-1, j+1] > 0 and \\
> +               flat[i, j-1] > 0 and \\
> +               flat[i, j+1] > 0 and \\
> +               flat[i+1, j-1] > 0 and \\
> +               flat[i+1, j] > 0 and \\
> +               flat[i+1, j+1] > 0:
> +               pixels_on_path.append((i, j))
>
> flat[flat == 255] = 0 # Make all white pixels 0s
> flat[flat > 0] = 1 # Make all colored pixels 1s
> flat = flat.astype(int) # Convert to int
> ```
>
> Later we can just mark all of these as 1s.

> **Black pixels** always have a black neighbor (4 directions). If they don't, it meanr they're on the path. Like above, we can mark it before converting the image:
>
> ```diff
> flat = np.average(matrix, axis=2)
>
> +pixels_on_path = []
> +for i in range(1, flat.shape[0] - 1):
> +   for j in range(1, flat.shape[1] - 1):
> +       # A white pixel is on the path if all pixels in a 3x3 square around it are NOT black
> +       if flat[i, j] == 0:
> +           if flat[i-1, j] != 0 and \\
> +               flat[i+1, j] != 0 and \\
> +               flat[i, j-1] != 0 and \\
> +               flat[i, j+1] != 0:
> +               pixels_on_path.append((i, j))
>
> flat[flat == 255] = 0 # Make all white pixels 0s
> flat[flat > 0] = 1 # Make all colored pixels 1s
> flat = flat.astype(int) # Convert to int
> ```
>
> And again, we mark them as 1s later.

_Note that this doesn't take into account a black and white pixel on the path right next to each other. Sometimes it's better to keep things simple and just hope they work out. In this case it paid off._

Combining all of this we get:

```py
flat = np.average(matrix, axis=2)
pixels_on_path = []
for i in range(1, flat.shape[0] - 1):
    for j in range(1, flat.shape[1] - 1):
        # A white pixel is on the path if all pixels in a 3x3 square around it are NOT black
        if flat[i, j] == 255:
            if flat[i-1, j-1] > 0 and \\
                flat[i-1, j] > 0 and \\
                flat[i-1, j+1] > 0 and \\
                flat[i, j-1] > 0 and \\
                flat[i, j+1] > 0 and \\
                flat[i+1, j-1] > 0 and \\
                flat[i+1, j] > 0 and \\
                flat[i+1, j+1] > 0:
                pixels_on_path.append((i, j))
        # A black pixel is on the path if it has no black neighbors
        if flat[i, j] == 0:
            if flat[i-1, j] != 0 and \\
                flat[i+1, j] != 0 and \\
                flat[i, j-1] != 0 and \\
                flat[i, j+1] != 0:
                pixels_on_path.append((i, j))

flat[flat == 255] = 0 # Make all white pixels 0s
flat[flat > 0] = 1 # Make all colored pixels 1s
flat = flat.astype(int) # Convert to int
for i, j in pixels_on_path:
    flat[i, j] = 1
```

If we now rerun the maze solving code from above with the pixel fix...

```log
operations: 4639249 path length: 3506581
+--------------------------------------------------
|##s############################################### ...
...
```

We've got a path!

### Getting the colors

Now that we have a valid path, let's collect the colors along it. Thankfully this is quite easy with the pathfinding library:

```py
colors = []
for i, j in path:
    colors.append(matrix[j, i]) # NumPy indexes with row, col (y,x)
colors
```

```log
[array([137,  80,  78], dtype=uint8),
 array([71, 13, 10], dtype=uint8),
...
```

## Using the colors

Now that we have the colors what are they used for? First, some practical information.

- Each pixel has 3 color values.
- Each color value is 1 byte.
- The pixels are ordered.

Let's try flattening the colors array.

```py
>>> colors = np.array(colors).flatten
>>> colors
array([137,  80,  78, ...,  75,  78, 197], dtype=uint8)
```

Well, that's expected. Let's try some different encodings and see if we don't get anything interesting. We start with text. Maybe the flag is hiding in a regular text encoding.

```py
>>> cbytes = [bytes([c]) for c in colors]
>>> cbytes # Bytes are automatically converted to text when printed
[b'\\x89', b'P', b'N', b'G', b'\\r', b'\\n', b'\\x1a', b'\\n',
 b'\\x00', b'\\x00', b'\\x00', b'\r', b'I', b'H', b'D', b'R', ...]

```

### So what's the result?

Well well well. Not the flag we were hoping for, but there is something here. This looks like a [PNG header](https://en.wikipedia.org/wiki/PNG#File_header). There's the `PNG` identification and `IHDR`. Let's try saving the bytes to an image.

```py
with open('out.png', 'wb') as f:
    f.write(b''.join(cbytes))
```

aaand

<details>
<summary>Click to expand</summary>

![Maze 2](/media/writeups/fectf23/inception/out.png)

</details>
it's another maze... Guess that's what they mean by "Inception". Thankfully we already have all the necessary code and can just compile it into a solve script!

## Solvescript

<details>
<summary>Click to reveal solvescript</summary>

```py
import io
import os
import numpy as np
from PIL import Image
from pathfinding.core.diagonal_movement import DiagonalMovement
from pathfinding.core.grid import Grid
from pathfinding.finder.a_star import AStarFinder
from pathfinding.core.node import GridNode

class Solver:
    def __init__(self, maze_arr: np.ndarray):
        self.maze_arr = maze_arr
        maze_flat = np.average(maze_arr, axis=2)
        bw_wide = np.copy(maze_flat)
        bw_wide[bw_wide > 0] = 1 # maze where walls are black and everything else is white
        bw_thin = np.copy(maze_flat)
        bw_thin[bw_thin == 255] = 0
        bw_thin[bw_thin > 0] = 1 # maze only the colored path is white and everything else is black

        self.maze_flat = maze_flat
        self.maze_wide = bw_wide.astype(int)
        self.maze_thin = bw_thin.astype(int)

    def solve(self):
        '''Solve the maze and return the solution path'''
        print("    Starting to solve", end="\r")
        # Clean maze
        maze = self.fix_maze()
        # Create grid
        print("    Solving: Creating maze graph...", end="\r")
        grid = Grid(matrix=maze)
        # Find the start and end points
        start = grid.node(2, 0)
        end = grid.node(maze.shape[0] - 3, maze.shape[1] - 1)
        # Solve!
        print("    Solving: Solving maze...        ", end="\r")
        finder = AStarFinder(diagonal_movement=DiagonalMovement.never)
        path, runs = finder.find_path(start, end, grid)
        return path

    def fix_maze(self):
        '''Fix the maze by correctly coloring black/white pixels on the path'''
        print("    Solving: Fixing pixels...", end="\r")
        # All path pixels should be white
        maze_thin_clean = np.copy(self.maze_thin)
        for i, j in self.find_pixels_on_path():
            maze_thin_clean[i, j] = 1
        return maze_thin_clean.astype(int)

    def find_pixels_on_path(self):
        '''Find black/white pixels on the solution path'''
        pixels_on_path = []
        for i in range(1, self.maze_wide.shape[0] - 1):
            for j in range(1, self.maze_wide.shape[1] - 1):
                # A white pixel is on the path if all pixels in a 3x3 square around it are NOT black
                if self.maze_flat[i, j] == 255:
                    if self.maze_flat[i-1, j-1] > 0 and \
                        self.maze_flat[i-1, j] > 0 and \
                        self.maze_flat[i-1, j+1] > 0 and \
                        self.maze_flat[i, j-1] > 0 and \
                        self.maze_flat[i, j+1] > 0 and \
                        self.maze_flat[i+1, j-1] > 0 and \
                        self.maze_flat[i+1, j] > 0 and \
                        self.maze_flat[i+1, j+1] > 0:
                        pixels_on_path.append((i, j))
                # A black pixel is on the path if it has no black neighbors
                if self.maze_wide[i, j] == 0:
                    if self.maze_wide[i-1, j] == 1 and \
                        self.maze_wide[i+1, j] == 1 and \
                        self.maze_wide[i, j-1] == 1 and \
                        self.maze_wide[i, j+1] == 1:
                        pixels_on_path.append((i, j))
        return pixels_on_path

class ImageMaker:
    def __init__(self, maze_arr: np.ndarray, path: list[GridNode]):
        self.maze_arr = maze_arr
        self.path = path

    def get_image(self):
        '''Turns the maze and solution into a bytes object'''
        print("    Creating image...", end="\r")
        # Get colors from path
        colors = np.array(self.get_colors()).flatten()
        # Turn each color into bytes
        color_bytes = [bytes([c]) for c in colors]
        return b''.join(color_bytes)

    def get_colors(self):
        '''Get the colors of the solution path'''
        # Flipped cause numpy
        return [self.maze_arr[j, i] for i, j in self.path]

class ImgTools:
    @staticmethod
    def validate(path):
        '''Check if the image is valid'''
        try:
            Image.open(path)
            return True
        except:
            return False
    @staticmethod
    def load(path):
        '''Load the image'''
        return np.array(Image.open(path))

c = 1
maze = ImgTools.load(f"maze.png")
while True:
    print(f"Solving maze {c}")
    c += 1

    solver = Solver(maze)
    solution = solver.solve()
    print()
    maker = ImageMaker(maze, solution)
    submaze = maker.get_image()
    print()

    try:
        maze = np.array(Image.open(io.BytesIO(submaze)))
        # Make sure the dir "mazes" exists
        os.makedirs("mazes", exist_ok=True)
        with open(f"mazes/maze{c}.png", "wb") as f:
            f.write(submaze)
    except:
        # No more mazes, grep for flag
        print(submaze)
        break
```

</details>
