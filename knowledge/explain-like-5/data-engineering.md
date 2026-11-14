# Data Engineering — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Data pipeline
🚰 Water pipes from a river: pump it, clean it, store it in a tank, deliver it to taps.
**Really:** moving data from sources, cleaning it, and loading it where people use it.

## ETL vs ELT
🥕 ETL: wash and chop vegetables before putting them in the fridge. ELT: put them in the fridge first, chop when you cook.
**Really:** transform before loading vs load raw and transform later.

## Data lake vs warehouse
🧺 A lake is a big basket where you throw everything; a warehouse is labelled shelves of sorted items.
**Really:** raw files of any type vs cleaned, structured tables.

## Star schema
⭐ A sales receipt in the middle, with arrows to "who bought", "what", "when", "where".
**Really:** a fact table linked to dimension tables.

## Partitioning
🗃️ Filing papers in folders by month, so you only open November's folder.
**Really:** splitting data by a column so queries skip the rest.

## Spark
👷‍♀️👷 One huge pile of bricks moved by 100 workers at once instead of one.
**Really:** processing data in parallel across many machines.

## Shuffle
🃏 Collecting every player's cards and re-dealing them by suit — slow because everyone must hand over cards.
**Really:** moving data between machines to group it.
