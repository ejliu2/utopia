import minesweeper

def main():
    print("running")
    numOfRows = 20
    numOfCols = 20
    numOfBombs = 40
    count = 0
    game = minesweeper.startGame(numOfRows, numOfCols, numOfBombs)
    for i, value in enumerate(game):
        row = i / numOfRows
        col = i % numOfCols
        print(" ")
        if (value == -1):
            count += 1
            print(value, " ")
        else:
            print(" ", value)
        if (col == numOfCols-1):
            print("\n")
    print("The number of mines is: ", count)