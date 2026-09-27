# SQL Canonical Evidence Report

Generated from existing Tech-Mastery-Hub material. This report is evidence only and does not modify learning content.

## knowledge\masterclasses\SQL_MasterClass.html

```text
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SQL Masterclass</title>
    <!-- Reveal.js CSS for Animations and Slide formatting -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reset.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/theme/simple.min.css">
    
    <style>
        /* Custom Presentation Styling */
        .reveal { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .reveal h1, .reveal h2, .reveal h3 { font-weight: 700; text-transform: none; color: #1a365d; text-align: left; }
        .reveal h2 { font-size: 1.6em; border-bottom: 3px solid #3182ce; padding-bottom: 10px; display: inline-block; margin-bottom: 30px; }
        
        /* Strict 50/50 Split Layout */
        .split-layout {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            height: 65vh;
            width: 100%;
            gap: 20px;
        }
        
        /* Left Column: Content (Max 50%) */
        .left-col {
            width: 50%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: left;
            font-size: 0.65em;
            line-height: 1.5;
        }
        
        .left-col ul { margin-left: 20px; padding-left: 0; }
        .left-col li { margin-bottom: 15px; }
        .highlight { color: #e53e3e; font-weight: bold; }
        .code-inline { background: #edf2f7; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #c53030;}
        
        /* Right Column: Images & Diagrams (Max 50%) */
        .right-col {
            width: 50%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f7fafc;
            border-radius: 12px;
            padding: 10px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
            box-sizing: border-box;
        }

        /* The rule that strictly prevents image cut-off */
        .right-col img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain; /* Forces image to scale without clipping */
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        /* Custom HTML/CSS Diagrams (To replace broken web images) */
        .css-diagram { display: flex; flex-direction: column; align-items: center; width: 100%; font-size: 0.5em; gap: 10px; }
        .box { background: white; border: 2px solid #3182ce; padding: 15px; border-radius: 8px; width: 80%; text-align: center; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.1);}
        .arrow { font-size: 2em; color: #718096; margin: -5px 0; }
        
        .grid-diagram { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; }
        .grid-diagram .box { width: auto; font-size: 0.9em; padding: 10px;}
        
        pre { width: 100%; background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 8px; font-size: 0.9em; overflow-x: hidden;}
    </style>
</head>
<body>
    <div class="reveal">
        <div class="slides">

            <!-- Slide 1: Title -->
            <section>
                <h1 style="text-align: center; font-size: 2.5em;">SQL Masterclass</h1>
                <p style="text-align: center; color: #4a5568;">From Foundational Engine Architecture to Advanced Execution Strategies</p>
            </section>

            <!-- Slide 2 -->
            <section>
                <h2>1. What is SQL & RDBMS?</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li><strong>SQL</strong> communicates with a Relational Database Management System (RDBMS).</li>
                            <li><strong>The Relational Model:</strong> Data is normalized into logical Tables (Entities) consisting of Rows (Records) and Columns (Attributes).</li>
                            <li><strong>Primary Keys (PK):</strong> A unique, non-null identifier for a row (e.g., <span class="code-inline">User_ID</span>).</li>
                            <li><strong>Foreign Keys (FK):</strong> A column linking to the PK of another table. This enforces <em>Referential Integrity</em> (e.g., you can't create an order for a non-existent user).</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <div class="css-diagram">
                            <div class="box" style="border-color: #38a169;">Users Table (PK: User_ID)</div>
                            <div class="arrow">&darr; 1 to Many &darr;</div>
                            <div class="box" style="border-color: #3182ce;">Orders Table (FK: User_ID)</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Slide 3 -->
            <section>
                <h2>2. Inside the Engine Pipeline</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li>Your query doesn't go straight to the hard drive. It passes through a complex pipeline.</li>
                            <li><strong>1. The Parser:</strong> Validates syntax (spelling) and semantics (checks the data dictionary to ensure tables/columns actually exist).</li>
                            <li><strong>2. The Optimizer:</strong> The "brain". It calculates possible execution paths and chooses the lowest "cost" plan based on CPU/memory statistics.</li>
                            <li><strong>3. The Executor:</strong> Follows the plan, requests physical data blocks from the Storage Engine, and streams the result.</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <div class="css-diagram">
                            <div class="box">SQL Query Text</div>
                            <div class="arrow">&darr;</div>
                            <div class="box">Parser (Syntax Check)</div>
                            <div class="arrow">&darr;</div>
                            <div class="box" style="background: #ebf8ff;">Optimizer (Cost Math)</div>
                            <div class="arrow">&darr;</div>
                            <div class="box">Executor (Data Retrieval)</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Slide 4 -->
            <section>
                <h2>3. The 1,000 Record Problem</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li><strong>Full Table Scan (No Index):</strong> Imagine searching a 1,000 record table. The engine reads every row sequentially. Even if it finds the match at row 500, it continues to row 1,000 checking for duplicates. This is an <strong>O(N) operation</strong>.</li>
                            <li><strong>Index Seek (With Index):</strong> An Index builds a highly optimized structure storing sorted IDs with a pointer to the disk location.</li>
                            <li>Searching for ID 500 navigates a tree: Is 500 > 500? No. > 250? Yes. It finds the row in ~10 operations (Log2 of 1000). This <strong>O(log N) operation</strong> scales instantly.</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <div class="css-diagram" style="flex-direction: row; gap: 20px;">
                            <div class="box" style="background: #fed7d7;">Full Scan<br>O(N)<br>1000 Reads</div>
                            <div class="box" style="background: #c6f6d5;">Index Seek<br>O(log N)<br>~10 Reads</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Slide 5 -->
            <section>
                <h2>4. Deep Dive: B-Tree Indexes</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li>Relational databases use a <strong>B-Tree (Balanced Tree)</strong> for log N search times.</li>
                            <li><strong>Clustered Index:</strong> Dictates the physical sorting of the table on the hard disk. The "leaf" nodes contain the actual row data.</li>
                            <li><strong>Non-Clustered Index:</strong> A separate structure. The leaf nodes contain a pointer reference back to the Clustered Index to fetch the full row.</li>
                            <li><strong>The Trade-off:</strong> Indexes massively speed up <span class="code-inline">SELECT</span>, but slow down <span class="code-inline">INSERT/UPDATE</span> because the tree must be constantly re-balanced.</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <div class="css-diagram">
                            <div class="box" style="width: 40%">Root Node (1-1000)</div>
                            <div style="display: flex; gap: 20px; width: 100%; justify-content: center; margin-top: 10px;">
                                <div class="box" style="width: 30%">1-500</div>
                                <div class="box" style="width: 30%">501-1000</div>
                            </div>
                            <div style="display: flex; gap: 5px; width: 100%; justify-content: center; margin-top: 10px;">
                                <div class="box" style="width: 20%; background: #e2e8f0;">Leaf (Data)</div>
                                <div class="box" style="width: 20%; background: #e2e8f0;">Leaf (Data)</div>
                                <div class="box" style="width: 20%; background: #e2e8f0;">Leaf (Data)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Slide 6 -->
            <section>
                <h2>5. Logical Order of Execution</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <p>You write SQL starting with SELECT, but the engine reads it differently. <strong>This is the #1 debugging secret.</strong></p>
                        <ol>
                            <li><strong>FROM / JOIN:</strong> Gathers and merges base tables.</li>
                            <li><strong>WHERE:</strong> Filters raw data. (You cannot use SELECT aliases here yet!).</li>
                            <li><strong>GROUP BY:</strong> Aggregates data into buckets.</li>
                            <li><strong>HAVING:</strong> Filters the aggregated buckets.</li>
                            <li><strong>SELECT:</strong> Chooses columns and calculates math.</li>
                            <li><strong>ORDER BY / LIMIT:</strong> Sorts and restricts output.</li>
                        </ol>
                    </div>
                    <div class="right-col">
                        <div class="css-diagram">
                            <div class="box">1. FROM</div>
                            <div class="box">2. WHERE</div>
                            <div class="box">3. GROUP BY / HAVING</div>
                            <div class="box" style="background:#bee3f8;">4. SELECT</div>
                            <div class="box">5. ORDER BY</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Slide 7 -->
            <section>
                <h2>6. Category: Select & Filter</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li><strong>LIKE operator dangers:</strong> Using a wildcard at the start (<span class="code-inline">LIKE '%son'</span>) forces a full table scan because the B-Tree index cannot search backwards.</li>
                            <li><strong>IN vs OR:</strong> <span class="code-inline">IN (1, 2)</span> is internally converted to a binary search if indexed, making it much faster than chaining <span class="code-inline">OR</span> conditions.</li>
                            <li><strong>DISTINCT:</strong> Involves an expensive SORT/HASH operation. Never use it as a band-aid for bad joins creating duplicates.</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <!-- Strict bounding box ensures no cut off -->
                        <img src="50596.jpg" alt="Select and Filter">
                    </div>
                </div>
            </section>

            <!-- Slide 8 -->
            <section>
                <h2>7. Interview Trap: WHERE vs HAVING</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <p><strong>The Trap:</strong> Candidates often just say "HAVING is for GROUP BY." This doesn't demonstrate engine knowledge.</p>
                        <p><strong>The Expert Answer:</strong> Both filter data, but at completely different pipeline stages.</p>
                        <ul>
                            <li><strong>WHERE</strong> filters individual raw rows <em>before</em> any grouping happens. Indexes can be used here.</li>
                            <li><strong>HAVING</strong> filters aggregated buckets of data <em>after</em> the GROUP BY math is calculated. Indexes cannot be used here.</li>
                        </ul>
                    </div>
                    <div class="right-col">
<pre><code>-- WHERE filters the raw rows
SELECT department, SUM(sales)
FROM employee_sales
WHERE year = 2024 

-- GROUP BY collapses the rows
GROUP BY department

-- HAVING filters the total buckets
HAVING SUM(sales) > 100000;</code></pre>
                    </div>
                </div>
            </section>

            <!-- Slide 9 -->
            <section>
                <h2>8. Category: Joins</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li>Joins mathematically combine sets of data by calculating a Cartesian Product and filtering it via the <span class="code-inline">ON</span> clause.</li>
                            <li><strong>INNER JOIN:</strong> Returns only the intersection. Data must exist in both tables.</li>
                            <li><strong>LEFT JOIN:</strong> Retains all rows from the driving (left) table. Crucial for finding missing records by looking for NULLs on the right.</li>
                            <li><strong>FULL OUTER:</strong> Returns all rows from both tables, placing NULLs where there is no match.</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <img src="50597.jpg" alt="Joins">
                    </div>
                </div>
            </section>

            <!-- Slide 10 -->
            <section>
                <h2>9. Deep Dive: Join Algorithms</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <p>When you write a JOIN, the engine physically executes it using one of three algorithms:</p>
                        <ul>
                            <li><strong>Nested Loop:</strong> For every row in Table A, scan Table B. Fast only if Table A is very small and Table B is indexed.</li>
                            <li><strong>Hash Match:</strong> Hashes the smaller table into memory buckets, then scans the larger table to probe them. High memory usage, but fast for unsorted datasets.</li>
                            <li><strong>Merge Join:</strong> Both inputs are sorted on the join key. The engine simply zips them together. Highly efficient.</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <div class="grid-diagram">
                            <div class="box" style="background: #ebf8ff;">Nested Loop<br><span style="font-size:0.8em; font-weight:normal;">Row-by-row iteration</span></div>
                            <div class="box" style="background: #f0fff4;">Merge Join<br><span style="font-size:0.8em; font-weight:normal;">Sorted Zipping</span></div>
                            <div class="box" style="grid-column: span 2; background: #faf5ff;">Hash Match<br><span style="font-size:0.8em; font-weight:normal;">Memory Hash Buckets (Heavy lifting)</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Slide 11 -->
            <section>
                <h2>10. Interview Trap: The Self Join</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <p><strong>The Question:</strong> "You have an Employee table with emp_id, name, and manager_id. Return a list of employees alongside their manager's name."</p>
                        <p><strong>The Trap:</strong> Beginners get confused because there is only one table. How do you join a table to itself without a loop?</p>
                        <p><strong>The Expert Answer:</strong> Use a Self Join by leveraging Table Aliases. You instruct the engine to treat the single table as if it were two separate, independent tables.</p>
                    </div>
                    <div class="right-col">
<pre><code>SELECT 
  e.name AS Employee, 
  m.name AS Manager 
FROM Employees e 

-- Join the table to itself
LEFT JOIN Employees m 
  ON e.manager_id = m.emp_id;
  
-- Use LEFT JOIN so the CEO 
-- (no manager) isn't dropped.</code></pre>
                    </div>
                </div>
            </section>

            <!-- Slide 12 -->
            <section>
                <h2>11. Category: Aggregation & Grouping</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li><strong>GROUP BY Mechanics:</strong> The engine sorts the data based on your grouping columns, creating isolated "buckets", then applies math (SUM, AVG) to each.</li>
                            <li><strong>COUNT(*) vs COUNT(col):</strong> <span class="code-inline">COUNT(*)</span> counts the physical rows (including NULLs). <span class="code-inline">COUNT(col)</span> counts actual values, ignoring NULLs in that column.</li>
                            <li><strong>ROLLUP & CUBE:</strong> Automatically generate subtotals and grand totals in a single pass over the data.</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <img src="50598.jpg" alt="Aggregation and Grouping">
                    </div>
                </div>
            </section>

            <!-- Slide 13 -->
            <section>
                <h2>12. Category: Window Functions</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li>Window functions perform calculations across related rows <em>without</em> collapsing them into a single summary row.</li>
                            <li><strong>OVER():</strong> Defines the context "window". If left empty, the window is the entire result set.</li>
                            <li><strong>PARTITION BY:</strong> Resets the calculation for every unique value (e.g., Restarting a sales rank at 1 for each new Region).</li>
                            <li><strong>ORDER BY (Inside OVER):</strong> Dictates the sorting within the partition. Essential for functions like <span class="code-inline">LAG</span>.</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <img src="50599.jpg" alt="Window Functions">
                    </div>
                </div>
            </section>

            <!-- Slide 14 -->
            <section>
                <h2>13. Interview Trap: Ranking Functions</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <p><strong>The Question:</strong> "What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?"</p>
                        <p><strong>The Expert Answer:</strong> It is all about how they handle "Ties" (identical values).</p>
                        <ul>
                            <li><strong>ROW_NUMBER():</strong> Assigns a unique integer (1, 2, 3, 4). Breaks ties arbitrarily.</li>
                            <li><strong>RANK():</strong> Assigns the same rank to ties, but <em>skips</em> the next numbers. (1, 2, 2, 4). Use for Olympic medals.</li>
                            <li><strong>DENSE_RANK():</strong> Assigns the same rank to ties, but <em>does not skip</em>. (1, 2, 2, 3). Use for "Top 3 highest paid".</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <div class="css-diagram" style="align-items: flex-start; text-align: left; padding: 20px;">
                            <p><strong>Data:</strong> 100, 100, 50</p>
                            <p><span class="highlight">ROW_NUMBER:</span> 1, 2, 3</p>
                            <p><span class="highlight">RANK:</span> 1, 1, 3</p>
                            <p><span class="highlight">DENSE_RANK:</span> 1, 1, 2</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Slide 15 -->
            <section>
                <h2>14. Category: Subqueries</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li>A subquery is a query nested inside another query.</li>
                            <li><strong>Scalar Subquery:</strong> Returns exactly one value. Used in mathematical comparisons (e.g., <span class="code-inline">> (SELECT AVG(salary)...)</span>).</li>
                            <li><strong>List Subquery:</strong> Returns a single column of multiple rows. Paired with <span class="code-inline">IN</span>.</li>
                            <li><strong>EXISTS:</strong> Highly optimized boolean check. It stops scanning the moment it finds a single true match, unlike IN which forces evaluation of the whole list.</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <img src="50600.jpg" alt="Subqueries">
                    </div>
                </div>
            </section>

            <!-- Slide 16 -->
            <section>
                <h2>15. Deep Dive: Correlated Subqueries</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <p><strong>Uncorrelated:</strong> Independent. The engine runs the inner query exactly once, and passes the result to the outer query. Very Fast.</p>
                        <p><strong>Correlated (PERFORMANCE KILLER):</strong> The inner query references a column from the outer query. The engine is forced to execute the inner query <em>once for every single row</em> in the outer query.</p>
                        <p><strong>The Fix:</strong> Correlated subqueries on large tables will freeze a database. Rewrite them as a JOIN or Window Function.</p>
                    </div>
                    <div class="right-col">
                        <div class="css-diagram">
                            <div class="box" style="background:#fed7d7;">Correlated (Looping)<br><span style="font-size:0.8em; font-weight:normal;">Outer Row 1 &rarr; Runs Inner<br>Outer Row 2 &rarr; Runs Inner<br>O(N * M) Complexity</span></div>
                            <div class="box" style="background:#c6f6d5;">Uncorrelated (Linear)<br><span style="font-size:0.8em; font-weight:normal;">Runs Inner Once &rarr; Passes List &rarr; Runs Outer<br>O(N + M) Complexity</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Slide 17 -->
            <section>
                <h2>16. Category: Data Shaping</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li>SQL is a powerful engine for applying business logic on the fly.</li>
                            <li><strong>CASE WHEN:</strong> The SQL equivalent of IF/ELSE. Evaluated sequentiallyâ€”the first condition to resolve to TRUE wins, subsequent conditions are ignored.</li>
                            <li><strong>COALESCE:</strong> Returns the first non-null value in a list. Critical for handling missing data mathematically without lengthy CASE statements.</li>
                            <li><strong>CAST vs CONVERT:</strong> Convert data types. CAST is ANSI-standard. CONVERT allows specific string formatting (SQL Server).</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <img src="50601.jpg" alt="Data Shaping">
                    </div>
                </div>
            </section>

            <!-- Slide 18 -->
            <section>
                <h2>17. Category: CTEs & Set Operations</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li><strong>CTEs (WITH clause):</strong> Acts as a virtual, temporary view that exists only during query execution. Vastly improves readability over nested subqueries.</li>
                            <li><strong>Recursive CTEs:</strong> A CTE that references itself, used heavily for walking hierarchical tree data (like Org Charts).</li>
                            <li><strong>VIEWS:</strong> A saved query definition. It does not store physical data; it executes the script dynamically when queried.</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <img src="50602.jpg" alt="CTEs and Sets">
                    </div>
                </div>
            </section>

            <!-- Slide 19 -->
            <section>
                <h2>18. Interview Trap: UNION vs UNION ALL</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <p><strong>The Question:</strong> "What is the difference between UNION and UNION ALL? Which is faster?"</p>
                        <p><strong>The Trap:</strong> Candidates know UNION removes duplicates, but fail to explain the mechanical performance penalty.</p>
                        <p><strong>The Expert Answer:</strong> <span class="code-inline">UNION ALL</span> blindly stacks the datasets vertically. It is extremely fast. <span class="code-inline">UNION</span> must remove duplicates, forcing the engine to perform a massive, memory-intensive SORT/HASH over the entire dataset. Always default to UNION ALL.</p>
                    </div>
                    <div class="right-col">
                        <div class="css-diagram">
                            <div class="box" style="background:#c6f6d5;">UNION ALL<br>Instant vertical stacking</div>
                            <div class="box" style="background:#fed7d7;">UNION<br>Stack + Expensive HASH Sort</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Slide 20 -->
            <section>
                <h2>19. Category: Data Quality</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li>Real-world databases are messy. Data profiling is mandatory.</li>
                            <li><strong>Duplicate Checking:</strong> Usually done by grouping on natural keys and using <span class="code-inline">HAVING COUNT(*) > 1</span>.</li>
                            <li><strong>Handling NULLs:</strong> NULL is not zero or an empty string. It is "unknown". Any math with NULL results in NULL. You must use <span class="code-inline">IS NULL</span>, not <span class="code-inline">= NULL</span>.</li>
                            <li><strong>IS DISTINCT FROM:</strong> Safely compares two columns that might contain NULLs, avoiding UNKNOWN evaluations.</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <img src="50603.jpg" alt="Data Quality">
                    </div>
                </div>
            </section>

            <!-- Slide 21 -->
            <section>
                <h2>20. Category: Date & Time</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li>Time-series analysis relies heavily on Date functions.</li>
                            <li><strong>DATE_TRUNC():</strong> Useful for time-series charts. It "rounds down" a timestamp to the nearest month, week, or day.</li>
                            <li><strong>EXTRACT():</strong> Pulls a specific integer component (like the Year or Month) out of a timestamp for grouping logic.</li>
                            <li><strong>DATEDIFF():</strong> Calculates the mathematical delta between two dates. Crucial for SLA or churn metrics.</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <img src="50604.jpg" alt="Date and Time">
                    </div>
                </div>
            </section>

            <!-- Slide 22 -->
            <section>
                <h2>21. Category: Strings & Math</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li>Functions used for cleaning messy user input and standardizing output.</li>
                            <li><strong>TRIM():</strong> Removes leading/trailing whitespace. Essential when joining on string columns with hidden spaces.</li>
                            <li><strong>LOWER() / UPPER():</strong> Forces case consistency. Use when filtering strings to prevent missing case-sensitive matches.</li>
                            <li><strong>CEIL() / FLOOR():</strong> Rounds up to the next integer, or drops the decimal completely (pagination, bucket sizing).</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <img src="50605.jpg" alt="Strings and Math">
                    </div>
                </div>
            </section>

            <!-- Slide 23 -->
            <section>
                <h2>22. Server Objects: Stored Procedures</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <ul>
                            <li><strong>Pre-compiled Logic:</strong> Procedures are blocks of SQL saved on the server. Because they are compiled, the DB caches their Execution Plan, making them faster for repeated tasks.</li>
                            <li><strong>Procedural Flow:</strong> They support variables, loops (WHILE), IF/ELSE statements, and data modification.</li>
                            <li><strong>Security:</strong> Instead of granting users direct access to tables, grant execute permissions on a procedure, abstracting the schema.</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <div class="css-diagram">
                            <div class="box">Application Call (Parameters)</div>
                            <div class="arrow">&darr;</div>
                            <div class="box" style="background:#e2e8f0;">Stored Procedure (Cached Plan)</div>
                            <div class="arrow">&darr;</div>
                            <div class="grid-diagram">
                                <div class="box" style="border-color:#38a169;">Update Tables</div>
                                <div class="box" style="border-color:#3182ce;">Return Dataset</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Slide 24 -->
            <section>
                <h2>23. App Integration: Java JDBC</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <p>How a Java backend calls a Stored Procedure using JDBC.</p>
                        <ul>
                            <li><strong>CallableStatement:</strong> The interface used to execute procedures. It prevents SQL Injection via parameterization.</li>
                            <li><strong>Performance:</strong> Sending a single <span class="code-inline">{call sp_name}</span> command reduces network payload compared to sending massive raw SQL strings over the wire.</li>
                        </ul>
                    </div>
                    <div class="right-col">
<pre><code>// 1. Connect & Prepare
Connection conn = DriverManager
  .getConnection(dbUrl, user, pass); 

CallableStatement stmt = conn
  .prepareCall("{call sp_GetEmp(?)}"); 

// 2. Set Parameter & Execute
stmt.setInt(1, 101); // Employee ID
ResultSet rs = stmt.executeQuery();

while(rs.next()) {
  System.out.println(rs.getString("Name"));
}</code></pre>
                    </div>
                </div>
            </section>

            <!-- Slide 25 -->
            <section>
                <h2>24. Deep Dive: ACID Transactions</h2>
                <div class="split-layout">
                    <div class="left-col">
                        <p>How databases ensure data integrity during crashes and concurrent updates.</p>
                        <ul>
                            <li><strong>Atomicity:</strong> "All or nothing." If a bank transfer (Update A, then Update B) fails midway, the entire transaction rolls back.</li>
                            <li><strong>Consistency:</strong> Data must always abide by defined constraints before and after the transaction.</li>
                            <li><strong>Isolation:</strong> Concurrent transactions do not interfere (using Row Locks).</li>
                            <li><strong>Durability:</strong> Once a COMMIT is issued, the change is written to non-volatile disk.</li>
                        </ul>
                    </div>
                    <div class="right-col">
                        <div class="grid-diagram" style="gap: 20px;">
                            <div class="box" style="background:#fed7d7; border-color:#e53e3e;"><strong>A</strong>tomicity<br><span style="font-size:0.7em; font-weight:normal;">All or Nothing</span></div>
                            <div class="box" style="background:#bee3f8; border-color:#3182ce;"><strong>C</strong>onsistency<br><span style="font-size:0.7em; font-weight:normal;">Valid State</span></div>
                            <div class="box" style="background:#c6f6d5; border-color:#38a169;"><strong>I</strong>solation<br><span style="font-size:0.7em; font-weight:normal;">Row Locking</span></div>
                            <div class="box" style="background:#fefcbf; border-color:#d69e2e;"><strong>D</strong>urability<br><span style="font-size:0.7em; font-weight:normal;">Saved to Disk</span></div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    </div>

    <!-- Reveal.js Initialization -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.js"></script>
    <script>
        Reveal.initialize({
            hash: true,
            controls: true,
            progress: true,
            center: true,
            transition: 'slide' // Animations!
        });
    </script>
</body>
</html>
```
## knowledge\concepts\database\sql\README.md

```text
# SQL

> Canonical concept page for SQL. This page is being constructed from existing Tech-Mastery-Hub source material.

## Definition

The canonical SQL definition and explanation will be derived from the existing SQL Masterclass, SQL visual notes, database roadmap material, interview material, and practice material.

## Related Masterclass

- [SQL Masterclass](../../masterclasses/SQL_MasterClass.html)

## Visual Notes

- [SQL Query 1](../../visual-notes/sql/SQL_Query_1.jpeg)
- [SQL Query 2](../../visual-notes/sql/SQL_Query_2.jpeg)
- [SQL Query 3](../../visual-notes/sql/SQL_Query_3.jpeg)
- [SQL Query 4](../../visual-notes/sql/SQL_Query_4.jpeg)
- [SQL Query 5](../../visual-notes/sql/SQL_Query_5.jpeg)
- [SQL Query 6](../../visual-notes/sql/SQL_Query_6.jpeg)
- [SQL Query 7](../../visual-notes/sql/SQL_Query_7.jpeg)
- [SQL Query 8](../../visual-notes/sql/SQL_Query_8.jpeg)
- [SQL Query 9](../../visual-notes/sql/SQL_Query_9.jpeg)
- [SQL Query 10](../../visual-notes/sql/SQL_Query_10.jpeg)
- [SQL Query 11](../../visual-notes/sql/SQL_Query_11.jpeg)
- [SQL Joins](../../visual-notes/backend/sql-joins.png)

## Interview Material

- [MySQL Interview Questions](../../../interview/backend/java/08-MySQL.md)

## Practice

- [MySQL Coding Practice](../../../practice/coding/sql/02-MySQL-coding.md)

## Roadmap

- [Database Roadmap](../../../roadmap/database/README.md)

## Sources

- `knowledge/masterclasses/SQL_MasterClass.html`
- `knowledge/visual-notes/sql/`
- `knowledge/visual-notes/backend/sql-joins.png`
- `interview/backend/java/08-MySQL.md`
- `practice/coding/sql/02-MySQL-coding.md`
- `roadmap/database/README.md`

## Content Status

- Structure: established
- Relationships: established
- Canonical explanation: pending source review
- Additional examples: pending source review

```
## interview\backend\java\08-MySQL.md

```text
### â“ What is an RDBMS?

### ðŸ“ Answer

An RDBMS stores data in **structured tables**, enforces **relationships using keys**, and guarantees **data integrity through constraints and transactions**.

- Data consistency
- Multi-user concurrency
- ACID compliance
- Complex querying

**Example**

```sql
CREATE TABLE employee (
  emp_id INT PRIMARY KEY,
  name VARCHAR(50),
  salary NUMBER
);
```

ðŸ¤”â“ How is RDBMS different from DBMS?
DBMS doesnâ€™t enforce relationships or ACID strictly.

ðŸ¤”â“ Can RDBMS scale?
Vertically very well, horizontally with sharding/replication.

---

### â“ Primary Key vs Unique Key vs Foreign Key?

### ðŸ“ Answer

| Feature                         | **Primary Key**                         | **Unique Key**                           | **Foreign Key**                |
| ------------------------------- | --------------------------------------- | ---------------------------------------- | ------------------------------ |
| **What it does**                | Uniquely identifies each row in a table | Ensures values are not duplicated        | Links a table to another table |
| **Uniqueness**                  | Always unique                           | Always unique                            | Duplicates allowed             |
| **NULL values**                 | âŒ Not allowed                          | âœ” Allowed (Oracle allows multiple NULLs) | âœ” Allowed                      |
| **How many key can be defined** | only ONE (emp_id)                       | MULTIPLE (email, phone)                  | Multiple allowed               |

```sql
CREATE TABLE department (
  dept_id INT PRIMARY KEY,
  dept_name VARCHAR(50)
);

CREATE TABLE employee (
  emp_id INT PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  dept_id INT,
  CONSTRAINT fk_employee_department
    FOREIGN KEY (dept_id) REFERENCES department(dept_id)

-- dept_id INT - creates a column named dept_id in the employee table
-- CONSTRAINT - Constraint means setting a rule on the data
-- CONSTRAINT fk_employee_department - Naming a constraint is a best practice
-- FOREIGN KEY (dept_id) - dept_id is a foreign key (Means this column depends on another table)
-- REFERENCES department(dept_id) - value in employee.dept_id must exist in department.dept_id
);
```

ðŸ¤”â“ Can a foreign key be NULL?
Yes, unless **constrained**.

ðŸ¤”â“ What Is a Composite Primary Key?
A composite primary key is a **primary key made up of more than one column**.

```sql
-- Composite Primary Key
CREATE TABLE Employee_Project (
    emp_id INT,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    project_id INT,
    PRIMARY KEY (emp_id, project_id)
);

-- Composite Primary Key with Foreign Keys
CREATE TABLE Employee (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(50)
);

CREATE TABLE Project (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(50)
);

CREATE TABLE Employee_Project (
    emp_id INT,
    project_id INT,
    PRIMARY KEY (emp_id, project_id),
    FOREIGN KEY (emp_id) REFERENCES Employee(emp_id),
    FOREIGN KEY (project_id) REFERENCES Project(project_id)
);
```

---

### â“ What is Normalization?

### ðŸ“ Answer

Normalization is the process of **organizing database** tables to **reduce data duplication** and avoid data inconsistency.

Normalization avoids:

- **Insert anomaly** â€“ A new record cannot be inserted properly because some required data is missing.
- **Update anomaly** â€“ The same data exists in multiple places and is updated in one place but not everywhere.
- **Delete anomaly** â€“ Unintended loss of important data occurs when a record is deleted.

Normalization is a **DESIGN CHECK**, **not a DB rule.**

- No SQL constraint
- No MySQL / Oracle setting
- No â€œNORMALIZE TABLEâ€ command

> ðŸ‘‰ It happens at design time, when you analyze data relationships.

1ï¸âƒ£ **1NF - Can this column contain multiple values?**

âŒ Problem (Not in 1NF)

```text
Employee
--------------------------------
emp_id | emp_name | phone_numbers
--------------------------------
1      | Ravi     | 9876,1234
```

**Why wrong?**

- `phone_numbers` has **multiple values**
- Violates **atomic value rule**

âœ… Fix (Convert to 1NF)

Split multi-valued column into a new table.

```text
Employee
----------------------
emp_id | emp_name
----------------------
1      | Ravi
```

```text
Employee_Phone
------------------------
emp_id | phone_number
------------------------
1      | 9876
1      | 1234
```

âœ” Now each column has **single values**
âœ” No repeating groups

> â€œ1NF removes repeating groups and multi-valued attributes.â€

2ï¸âƒ£ **2NF - Does this column depend on the FULL primary key?**

ðŸ“Œ Rule

1. **Must already be in 1NF**
2. **No partial dependency**
   - Non-key column **must depend on full primary key**, not part of it

ðŸ“ Where this rule applies - **Table with Composite Primary Key**

âŒ Problem (Not in 2NF)

```text
Employee_Project
-----------------------------------
(emp_id, project_id) | emp_name
-----------------------------------
1, 101               | Ravi
```

**Primary Key:** `(emp_id, project_id)`

**Why wrong?**

- `emp_name` depends only on `emp_id`
- NOT dependent on `project_id`
- This is a **partial dependency**

âœ… Fix (Convert to 2NF)

Split table based on dependency.

```text
Employee
--------------------
emp_id | emp_name
--------------------
1      | Ravi
```

```text
Employee_Project
------------------------
emp_id | project_id
------------------------
1      | 101
```

âœ” Every non-key column depends on **whole key**

> â€œ2NF removes partial dependency from composite keys.â€

3ï¸âƒ£ **3NF - Is a non-key column depending on another non-key column?**

ðŸ“Œ Rule (What to add)

1. **Must already be in 2NF**
2. **No transitive dependency**
   - Non-key column should NOT depend on another non-key column

ðŸ“ Where this rule applies - **Column dependency level**

âŒ Problem (Not in 3NF)

```text
Employee
--------------------------------
emp_id | emp_name | dept_name
--------------------------------
1      | Ravi     | IT
```

**Hidden dependency:**

```text
emp_id â†’ dept_name
dept_name â†’ dept_location
```

So:

```text
emp_id â†’ dept_location  (Indirect / Transitive)
```

âœ… Fix (Convert to 3NF)

Split dependent attributes into separate tables.

```text
Employee
-----------------------
emp_id | emp_name | dept_id
-----------------------
1      | Ravi     | 10
```

```text
Department
-----------------------------------
dept_id | dept_name | dept_location
-----------------------------------
10      | IT        | Adelaide
```

âœ” Non-key columns depend **only on primary key**
âœ” No indirect dependency

> â€œ3NF removes transitive dependency.â€

---

### â“ What is Index?

### ðŸ“ Answer

An Index is a database object that improves the **speed of data retrieval** operations on a table.

- It works like a book index â†’ instead of scanning every page, you jump directly to the required page.
- Internally, most RDBMS use B-Tree (or sometimes Hash) structures.
- Indexes are created on one or more columns of a table.

```sql
CREATE INDEX idx_emp_email ON employee(email);
```

> âž¡ï¸ This allows faster searches on the email column.

**When Index is NOT Used, What Happens?**

1. Full Table Scan occurs

- The database checks every row in the table.
- Performance degrades heavily for large tables.

2. Effects:

- Slower SELECT queries
- Higher CPU and I/O usage

```sql
SELECT * FROM employee WHERE email = 'abc@xyz.com';
```

> âž¡ï¸ DB scans all rows to find the match

**Rules / Best Practices for Indexes**

âœ… When to Create an Index
âœ” Columns used in:

- WHERE
- JOIN
- ORDER BY
- GROUP BY
- PRIMARY KEY / UNIQUE

âŒ When NOT to Create an Index

- Columns with very few unique values (like gender or status)
- Frequent INSERT / UPDATE / DELETE
- Small tables (table scan is faster)

ðŸ¤”â“ How Many Indexes Can Be Used in a Query?

- Usually only ONE index per table is used in a query execution plan.
- However, Composite (multi-column) indexes count as one index
- A query involving **multiple tables can use one index per table**.
  ```sql
  SELECT *
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  WHERE c.email = 'x@y.com';
  ```
  âž¡ï¸ Index on customers.email
  âž¡ï¸ Index on orders.customer_id

---

### â“ Which performs better, `JOIN` or `SUBQUERY`?

### ðŸ“ Answer

ðŸ‘‰ JOIN usually performs better than a SUBQUERY

- Data is processed in a single execution plan
- Better use of indexes
- More readable and maintainable

```sql
-- Subquery
SELECT name
FROM employee
WHERE dept_id IN (
  SELECT dept_id FROM department WHERE location = 'NY'
);

-- JOIN
SELECT e.name
FROM employee e
JOIN department d
ON e.dept_id = d.dept_id
WHERE d.location = 'NY';
```

---

### â“ What is a View?

### ðŸ“ Answer

A View is a **virtual table** created from a SQL query.

- It does not store data itself
- It shows data from one or more tables
- It behaves like a table when you query it

```sql
--- CREATE A VIEW
CREATE VIEW active_employees AS
SELECT id, name, department
FROM employee
WHERE status = 'ACTIVE';

-- GET VIEW
SELECT * FROM active_employees;
```

---

### â“ What is a Stored Procedure?

### ðŸ“ Answer

A stored procedure is a **pre-written SQL program stored in the database** that can be executed by name to perform a specific task.

ðŸ‘‰ Think of it like a **function** in programming, but written in SQL and executed by the database.

ðŸ”¹ Why we use Stored Procedures?

- Reuse SQL logic (write once, use many times)
- Faster execution (precompiled)
- Better security (direct table access can be restricted)
- Keeps business logic close to the data

```sql
-- IN (Input parameter)
CREATE PROCEDURE getEmployeeById(IN empId INT)
BEGIN
  SELECT * FROM employee WHERE id = empId;
END;

-- Call it like this:
CALL getEmployeeById(101);

-------------------------------------------

-- OUT (Output parameter)
CREATE PROCEDURE getEmployeeCount(OUT totalEmployees INT)
BEGIN
  SELECT COUNT(*) INTO totalEmployees FROM employee;
END;

-- Call it like this:
CALL getEmployeeCount(@count);
SELECT @count;

-------------------------------------------

-- INOUT (Input + Output)
CREATE PROCEDURE increaseSalary(INOUT salary INT)
BEGIN
  SET salary = salary + 5000;
END;

-- Call it like this:
SET @sal = 40000;
CALL increaseSalary(@sal);
SELECT @sal;
```

ðŸ¤”â“ Stored Procedure vs Function?

- **Stored Procedure** - Used to perform actions (insert, update, delete, complex logic), May or may not return a value
- **Function** - Stored SQL block that **always returns a value**, Can be used inside SQL queries

```sql
-- FUNCTION
CREATE FUNCTION calculateBonus(salary DECIMAL(10,2))
RETURNS DECIMAL(10,2)
BEGIN
  RETURN salary * 0.10;
END;

-- Call it like this:
SELECT calculateBonus(salary) FROM employee;
```

ðŸ¤”â“ Cursor in Stored Procedure

A cursor is used to fetch and process query results row by row inside a stored procedure.

```sql
DECLARE cur CURSOR FOR SELECT salary FROM employee;
OPEN cur;
FETCH cur INTO empSalary;
CLOSE cur;
-- Each FETCH does
-- empSalary = 30000
-- empSalary = 40000
-- empSalary = 50000
```

**Scenario:**
You want to increase salary by 10% for employees one by one, and maybe do some logic per employee

    ```sql
    CREATE PROCEDURE incSalaryCursor()

    BEGIN
        DECLARE done INT DEFAULT 0;
        DECLARE id INT;
        DECLARE sal INT;

        DECLARE cur CURSOR FOR SELECT id, salary FROM employee; -- Defines the data the cursor reads
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1; -- Defines what happens when no more rows are available

        OPEN cur;

        LOOP
            FETCH cur INTO id, sal;
            IF done = 1 THEN LEAVE; END IF;

            UPDATE employee
            SET salary = sal * 1.10,
                role = REPLACE(role, 'Junior', 'Senior')
            WHERE id = id;

        END LOOP;

        CLOSE cur;
    END;

    -- CONTINUE â†’ continue execution
    -- HANDLER â†’ declares an exception handler
    -- FOR NOT FOUND â†’ condition when no rows are found (cursor end)
    -- SET done = 1 â†’ action to perform
    ```

ðŸ¤”â“ What is `REPLACE` in a Stored Procedure?

`REPLACE` is a string function used to replace part of a string with another string.

    ```sql
    SELECT REPLACE('Java Developer', 'Java', 'Angular');

    -- OUTPUT
    -- Angular Developer
    ```

ðŸ¤”â“ What is `DISTINCT`?

```sql
SELECT DISTINCT dept_id, salary FROM emp;
```

**Explanation:** DISTINCT applies to the **combined values**, not individual columns.

ðŸ¤”â“ `WHERE` vs `HAVING`

âœ… WHERE

- Filters **rows before GROUP BY**
- Faster
- Cannot use aggregate functions

```sql
SELECT * FROM orders WHERE status = 'PAID';
```

âœ… HAVING

- Filters **after GROUP BY**
- Used with aggregate functions

```sql
SELECT user_id, COUNT(*)
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 5;
```

ðŸ”‘ Key Difference

| WHERE           | HAVING             |
| --------------- | ------------------ |
| Before grouping | After grouping     |
| No aggregates   | Aggregates allowed |
| Faster          | Slower             |

ðŸ“Œ **Rule**:
ðŸ‘‰ Use `WHERE` whenever possible, `HAVING` only when needed.

ðŸ¤”â“ Order of SQL execution (VERY COMMON)

```text
FROM â†’ WHERE â†’ GROUP BY â†’ HAVING â†’ SELECT â†’ ORDER BY
```

ðŸ¤”â“ `DELETE` vs `TRUNCATE`

```sql
DELETE FROM emp;      -- rollback possible
TRUNCATE TABLE emp;   -- auto commit
```

ðŸ¤”â“ `BETWEEN` is inclusive

```sql
WHERE salary BETWEEN 5000 AND 10000;
```

Includes **5000 & 10000**.

ðŸ¤”â“ `LIKE` performance issue with `Index`

```sql
WHERE name LIKE '%John';
```

âŒ Index cannot help when the pattern starts with %

```sql
WHERE name LIKE 'John%';
```

âœ… The database can jump directly to John in the index

ðŸ¤”â“ `UNION` vs `UNION ALL`

- UNION â†’ Combines results of two or more SELECT queries and **Removes duplicate rows**
- UNION ALL â†’ Combines results of two or more SELECT queries and **Keeps all rows (including duplicates)**

ðŸ¤”â“ `COALESCE` vs `NVL`

Both are used to **replace NULL values**

**NVL** - Oracle only

```sql
NVL(salary, 0)
```

**COALESCE** - ANSI SQL standard (works in Oracle, MySQL, PostgreSQL, SQL Server, etc.)

```sql
SELECT COALESCE(salary, 0) FROM emp;
```

ðŸ¤”â“ Difference between `CHAR` and `VARCHAR`

Both store text

- CHAR â†’ fixed length

  ```sql
  CHAR(10)

  -- OUTPUT
  -- 'ABC       ' (3 chars + 7 spaces)
  ```

- VARCHAR â†’ variable length

  ```sql
  VARCHAR(10)

  -- OUTPUT
  -- 'ABC' (3 chars)
  ```

---

### â“ I see there is a performance issue with the DB. How will you identify the issue? Is there any log you can check?

### ðŸ“ Answer

ðŸŸ¢ STEP 1: CHECK MYSQL LOGS

1ï¸âƒ£ Slow Query Log

**Purpose:**
Identifies queries that take longer than expected.

```sql
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';
```

Enable if disabled:

```sql
SET GLOBAL slow_query_log = ON;
SET GLOBAL long_query_time = 2;
```

2ï¸âƒ£ Error Log

**Purpose:**
Detects crashes, deadlocks, disk issues.

```text
/var/log/mysql/error.log
```

Check for:

- InnoDB errors
- Disk full
- Out of memory
- Table corruption

3ï¸âƒ£ General Query Log (TEMPORARILY)

**Purpose:**
See _what queries are hitting DB right now_

```sql
SET GLOBAL general_log = ON;
```

âš ï¸ Disable quickly â€” very heavy.

4ï¸âƒ£ CHECK INDEX USAGE

**Verify indexes**

```sql
SHOW INDEX FROM orders;
```

**Find unused indexes**

```sql
performance_schema.table_io_waits_summary_by_index_usage;
```

ðŸ“Œ Missing index is the **#1 cause** of performance issues.

---

### â“ EXPLAIN / ANALYZE Query

### ðŸ“ Answer

`EXPLAIN` - shows **how MySQL executes a query**:

- Which index is used
- Join order
- Table scan or index scan
- Estimated rows

âœ… Why is it needed?

- To **find performance problems**
- To know **why a query is slow**
- To decide **which index to add or fix**

```sql
EXPLAIN
SELECT * FROM orders WHERE user_id = 10;
```

**Sample Output (important columns)**

| Column | Meaning                                   |
| ------ | ----------------------------------------- |
| type   | Access type (ALL = bad, ref/range = good) |
| key    | Index used                                |
| rows   | Rows MySQL expects to scan                |
| Extra  | Using where, Using index, etc.            |

`EXPLAIN ANALYZE` - Shows **actual execution time**, not estimates.

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 10;
```

ðŸ“Œ **Difference**

- `EXPLAIN` â†’ Estimated plan
- `EXPLAIN ANALYZE` â†’ Real execution time (best for optimization)

âœ… How it helps optimization?

- Finds **full table scans**
- Identifies **missing indexes**
- Reveals **bad join order**

Example optimization:

```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

---

### â“ JOIN Types (INNER, LEFT, RIGHT)

### ðŸ“ Answer

Assume:

- `users(id, name)`
- `orders(id, user_id)`

ðŸ”¹ **INNER JOIN**

Returns **matching rows only**

```sql
SELECT u.name, o.id
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

ðŸ“Œ If user has **no orders â†’ excluded**

ðŸ”¹ **LEFT JOIN**

Returns **all left table rows**

```sql
SELECT u.name, o.id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

ðŸ“Œ Users without orders â†’ `NULL` in order columns

ðŸ”¹ **RIGHT JOIN**

Returns **all right table rows**

```sql
SELECT u.name, o.id
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```

ðŸ“Œ Rarely used (LEFT JOIN is preferred)

ðŸ”‘ **JOIN Summary**

| Join  | Result              |
| ----- | ------------------- |
| INNER | Only matches        |
| LEFT  | All left + matches  |
| RIGHT | All right + matches |

---

### â“ Database Sharing

### ðŸ“ Answer

Multiple applications or services **using the same database**

âŒ Problems

- Performance bottlenecks
- Locking issues
- Tight coupling
- Risky deployments

âœ… Best Practice

- **One database per service**
- Shared DB only for:
  - Reporting
  - Legacy systems

ðŸ“Œ In microservices â†’ **Never share databases**

---

### â“ Database Replication

### ðŸ“ Answer

Copying data from **Primary (Master)** to **Replica (Slave)**

```
Primary â†’ Replica1 â†’ Replica2
```

âœ… Why needed?

- Read scalability
- High availability
- Backup & reporting

âœ… Types

| Type          | Use                        |
| ------------- | -------------------------- |
| Master-Slave  | Read scaling               |
| Master-Master | HA (complex)               |
| Async         | Fast, eventual consistency |
| Semi-sync     | Safer, slower              |

**Example Use Case**

```text
Writes â†’ Primary
Reads  â†’ Replica
```

ðŸ¤”â“ How they stay synced?
MySQL uses Asynchronous Replication by default. Here are the steps the system takes automatically:

**Binary Log (Primary):** The Original database records every change (Insert, Update, Delete) into a file called the `binlog`.

**Relay Log (Replica):** The Replica database connects to the Primary, reads the `binlog`, and copies it to its own file called the `relay log`.

**Applier Thread (Replica):** The Replica executes the queries in the `relay log` one by one to update its own data.

ðŸ¤”â“ How to check Sync Status

```sql
SHOW SLAVE STATUS\G
```

| Variable                | Target Value | Meaning                                 |
| ----------------------- | ------------ | --------------------------------------- |
| `Slave_IO_Running`      | Yes          | Connected to Primary and receiving logs |
| `Slave_SQL_Running`     | Yes          | Applying the logs to the data           |
| `Seconds_Behind_Master` | 0            | The Replica is perfectly synced         |

```properties
# Primary (Write)
spring.datasource.primary.url=jdbc:mysql://192.168.1.10:3306/db
spring.datasource.primary.username=admin
spring.datasource.primary.password=pass

# Replica (Read)
spring.datasource.replica.url=jdbc:mysql://192.168.1.50:3306/db
spring.datasource.replica.username=admin
spring.datasource.replica.password=pass
```

```java
public class RoutingDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        return TransactionSynchronizationManager.isCurrentTransactionReadOnly()
               ? "READ" : "WRITE";
    }
}

@Configuration
public class DataSourceConfig {
    @Bean
    public DataSource dataSource() {
        Map<Object, Object> targetDataSources = new HashMap<>();
        targetDataSources.put("WRITE", primaryDataSource());
        targetDataSources.put("READ", replicaDataSource());

        RoutingDataSource routingDataSource = new RoutingDataSource();
        routingDataSource.setTargetDataSources(targetDataSources);
        routingDataSource.setDefaultTargetDataSource(primaryDataSource());
        return routingDataSource;
    }
}

@Service
public class OrderService {

    // Goes to REPLICA (192.168.1.50)
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Goes to PRIMARY (192.168.1.10)
    @Transactional
    public void createOrder(Order order) {
        orderRepository.save(order);
    }
}
```

---

### â“ Production Bug / SQL Issue â€“ Root Cause Analysis

### ðŸ“ Answer

1.  Configuration

Run these in your MySQL client to enable logging to a table:

```sql
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL log_output = 'TABLE';
SET GLOBAL long_query_time = 2;

```

2.  The Retrieval Query

Use this to find the slowest queries and the tables involved:

```sql
SELECT
    start_time,
    user_host,
    query_time,
    rows_examined,
    sql_text
FROM mysql.slow_log
ORDER BY query_time DESC;

```

3.  Expected Sample Output

| start_time          | user_host              | query_time  | rows_examined | sql_text                                               |
| ------------------- | ---------------------- | ----------- | ------------- | ------------------------------------------------------ |
| 2026-02-04 10:30:01 | root[root] @ localhost | 00:00:05.12 | 500000        | `SELECT * FROM orders WHERE status = 'pending';`       |
| 2026-02-04 10:31:15 | app[app] @ 192.168.1.1 | 00:00:03.45 | 120000        | `SELECT name FROM users WHERE bio LIKE '%developer%';` |

4.  Diagnosing the Table

Take the `sql_text` from the results above and run:

```sql
EXPLAIN SELECT * FROM orders WHERE status = 'pending';

```

**Expected Sample Output:**

| id  | select_type | table      | type | key  | rows   | Extra       |
| --- | ----------- | ---------- | ---- | ---- | ------ | ----------- |
| 1   | SIMPLE      | **orders** | ALL  | NULL | 500000 | Using where |

_(Note: `type: ALL` and `key: NULL` confirms the table is slow because it is missing an index.)_

5. Verification Steps

Run the `EXPLAIN` command again to confirm the fix worked.

```sql
-- Check the new execution plan
EXPLAIN SELECT * FROM orders WHERE status = 'pending';

```

**Expected Result Comparison:**

| Feature  | Before Fix              | After Fix                            |
| -------- | ----------------------- | ------------------------------------ |
| **type** | `ALL` (Full Table Scan) | `ref` or `range` (Targeted Scan)     |
| **key**  | `NULL`                  | `idx_status` (The Index you created) |
| **rows** | `500,000`               | `120`                                |

6. If it is still slow (The Remaining 10%)

If indexes don't fix it, the issue is usually structural or hardware-related.

**SQL Fixes:**

- **Rewrite the Query:** Avoid `SELECT *`. Only fetch columns you need.

```sql
-- Better
SELECT id, order_date FROM orders WHERE status = 'pending';

```

- **Avoid Leading Wildcards:** Change `LIKE '%value%'` to `LIKE 'value%'`.

```sql
-- This cannot use a standard index
SELECT * FROM users WHERE email LIKE '%gmail.com';

```

**Database Fixes:**

- **Table Partitioning:** Splitting a 100-million-row table into smaller physical pieces.
- **Vertical Scaling:** Increasing Server RAM so the entire index fits in memory.

7. Summary of Results

| Action             | Impact | Result                                                   |
| ------------------ | ------ | -------------------------------------------------------- |
| **Create Index**   | High   | Reduces rows searched from millions to hundreds.         |
| **Optimize Table** | Medium | Reclaims space and reorganizes data for faster disk I/O. |
| **Rewrite Query**  | High   | Reduces CPU and memory load per request.                 |

---

### â“ What happens internally when a transaction fails midway in a Spring Boot application?

### ðŸ“ Answer

When a transaction fails midway in Spring Boot, the transaction is rolled back to maintain data consistency. Spring manages the transaction using `@Transactional`, but the actual rollback and consistency guarantees are enforced by the database.

This behavior is based on the **ACID** principles, which guarantee reliable database transactions.

ACID is a **set of properties that guarantee reliable database transactions**.

It is **mainly a Database concept**, but used through **JPA / Spring Boot / Java** when you perform transactions.

ACID stands for:

- **A â€“ Atomicity**
- **C â€“ Consistency**
- **I â€“ Isolation**
- **D â€“ Durability**

These properties ensure **safe and reliable transactions** in databases.

1ï¸âƒ£ Atomicity (All or Nothing)

ðŸ‘‰ A transaction must either complete fully or rollback fully.

Example:

```java
@Transactional
public void transferMoney() {
    debit(fromAccount);
    credit(toAccount);
}
```

If `credit()` fails â†’ `debit()` must rollback.

âœ… Either both happen
âŒ Or none happen

2ï¸âƒ£ Consistency (Valid State Only)

ðŸ‘‰ After transaction, DB must follow all rules:

- Primary key
- Foreign key
- Unique constraint
- Check constraints

Example:
If balance cannot be negative,
DB will reject invalid update.

3ï¸âƒ£ Isolation (No Interference Between Transactions)

ðŸ‘‰ Multiple users accessing same data should not corrupt it.

Example:
Two users booking last ticket at same time.

Isolation Levels (DB concept):

- READ UNCOMMITTED
- READ COMMITTED
- REPEATABLE READ
- SERIALIZABLE

In Spring:

```java
@Transactional(isolation = Isolation.SERIALIZABLE)
```

4ï¸âƒ£ Durability (Permanent After Commit)

ðŸ‘‰ Once transaction is committed, it stays saved even if:

- Server crashes
- Power fails

ðŸ”¥ Where is ACID Used?

| Layer       | Is ACID Here? | Explanation                       |
| ----------- | ------------- | --------------------------------- |
| Java        | âŒ No         | Java is just programming language |
| JPA         | âš ï¸ Partial    | JPA manages transactions          |
| Spring Boot | âš ï¸ Partial    | Uses `@Transactional`             |
| Database    | âœ… YES        | ACID is implemented at DB level   |

> ACID is **implemented by the Database**
> Spring / JPA just **use it via transactions**

---

### â“ How do you handle if multiple users / threads access same DB data at the same time?

### ðŸ“ Answer

When multiple users hit your Spring Boot app:

```
User 1 â†’ Thread 1 â†’ DB
User 2 â†’ Thread 2 â†’ DB
User 3 â†’ Thread 3 â†’ DB
```

Each request runs in its own thread,
but isolation control happens at **database level**.

ðŸ”¥ **How DB Handles Multiple Transactions**

Database uses:

1. **Locks**
2. **MVCC (Multi Version Concurrency Control)**
3. **Isolation Levels**

Letâ€™s see how.

1ï¸âƒ£ Using Isolation Levels in Spring

In Spring Boot:

```java
@Transactional(isolation = Isolation.REPEATABLE_READ)
public void bookTicket() {
    ...
}
```

Common levels:

| Level                | Simple Explanation                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **READ_UNCOMMITTED** | Can see uncommitted changes from other transactions (dirty reads possible). Rarely used.                                                   |
| **READ_COMMITTED**   | Each `SELECT` sees only committed data. If another transaction commits changes, the next read will see the updated value.                  |
| **REPEATABLE_READ**  | Within the same transaction, reading the same row twice gives the same result, even if another transaction updates and commits in between. |
| **SERIALIZABLE**     | Transactions behave as if executed one by one (like a queue). Prevents almost all concurrency issues but reduces performance.              |

Most DBs (like MySQL default) use:
ðŸ‘‰ **REPEATABLE_READ**

ðŸ¦ Scenario

Initial value in DB:

```
balance = 1000
```

Two transactions:

T1 â†’ Reads balance twice
T2 â†’ Updates balance to 2000 (but timing differs)

| Isolation Level  | What T1 Sees                              |
| ---------------- | ----------------------------------------- |
| READ_UNCOMMITTED | 2000 (even though T2 not committed)       |
| READ_COMMITTED   | 1000 â†’ 2000 (Only committed data visible) |
| REPEATABLE_READ  | 1000 â†’ 1000 (Snapshot view)               |
| SERIALIZABLE     | 1000 (T2 waits)                           |

2ï¸âƒ£ Locking Mechanism

When two users try to update same row:

Example:
Two users booking last seat.

DB does:

- First transaction â†’ acquires row lock
- Second transaction â†’ waits

After first commit:

- Second continues
- Or fails (depending on logic)

ðŸ”¹ **Pessimistic Locking (DB Level Lock)**

Used when you want strict control.

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT s FROM Seat s WHERE s.id = :id")
Seat findSeatForUpdate(Long id);
```

This prevents others from reading/updating that row.

ðŸ”¹ **Optimistic Locking (Version Based)**

Very common in enterprise apps.

```java
@Version
private Long version;
```

Flow:

1. User A reads version = 1
2. User B reads version = 1
3. User A updates â†’ version becomes 2
4. User B tries to update â†’ fails (version mismatch)

This throws:

```
OptimisticLockException
```

Then you retry or show error.

3ï¸âƒ£ Multiple Threads in Java

Important:

Each HTTP request â†’ separate thread
Spring does NOT share transaction between threads.

Example:

```java
@Transactional
public void updateBalance() {
   ...
}
```

Each thread gets:

- Separate DB connection
- Separate transaction

Thread safety at Java level is different from DB isolation.

If you modify shared memory in Java, then you need:

- synchronized
- ReentrantLock
- Concurrent collections

But for DB operations:
ðŸ‘‰ Isolation is DB responsibility.

ðŸ§  Real Example: Bank Transfer

_Scenario:_
Two users try to withdraw â‚¹1000 from same account with â‚¹1000 balance.

_Without isolation:_
Balance becomes -1000 âŒ

_With proper isolation:_

- First succeeds
- Second fails or waits

```
## practice\coding\sql\02-MySQL-coding.md

```text
### â“ Questions

> Given a Customer table and an Order table, can you write a SQL query to retrieve country-wise order analytics?
> How would you calculate the total number of orders placed per country?
> Can you identify the highest and lowest order amount for each country?
> How would you compute the average order value country-wise?
> Can you determine the total number of unique customers per country?
> How would you count orders whose amount is greater than 1000 and less than 5000 for each country?
> Finally, how would you sort the results based on country name?

### ðŸ“ Answer

```sql
SELECT
    c.country,                                       -- Country-wise grouping
    COUNT(o.order_id) AS total_orders,               -- Total number of orders
    MAX(o.order_amount) AS highest_order_amount,     -- Highest order amount
    MIN(o.order_amount) AS lowest_order_amount,      -- Lowest order amount
    AVG(o.order_amount) AS average_order_value,      -- Average order value
    COUNT(DISTINCT c.customer_id) AS total_customers,-- Total unique customers
    SUM(
        CASE
            WHEN o.order_amount > 1000
             AND o.order_amount < 5000
            THEN 1
            ELSE 0
        END
    ) AS orders_between_1000_and_5000                 -- Orders between 1000 and 5000
FROM customer c
JOIN orders o
    ON c.customer_id = o.customer_id                 -- Joining customer and order tables
GROUP BY c.country                                   -- Grouping by country
ORDER BY c.country;                                  -- Ordering result by country
```

---

### â“ What is the output of the following query?

> ```sql
> SELECT * FROM employee WHERE salary = NULL;
> ```

### ðŸ“ Answer

**Output:** âŒ No rows

âœ… Correct:

```sql
WHERE salary IS NULL;
```

---

### â“ **COUNT(\*), COUNT(col)**

> ```sql
> SELECT COUNT(*), COUNT(salary) FROM employee;
> ```

### ðŸ“ Answer

- `COUNT(*)` â†’ all rows
- `COUNT(salary)` â†’ excludes NULLs

---

### â“ **Second Highest Salary**

### ðŸ“ Answer

```sql
SELECT MAX(salary)
FROM employee
WHERE salary < (SELECT MAX(salary) FROM employee);

-- OR

SELECT age
FROM users
ORDER BY age DESC
LIMIT 1 OFFSET 1
```

---

### â“ **Duplicate Records**

### ðŸ“ Answer

```sql
SELECT name, COUNT(*)
FROM employee
GROUP BY name
HAVING COUNT(*) > 1;
```

---

### â“ **EXISTS vs IN**

> employee
>
> | id  | name  | dept_id |
> | --- | ----- | ------- |
> | 1   | Asha  | 10      |
> | 2   | Ravi  | 20      |
> | 3   | Meena | 10      |
>
> department
>
> | id  | dept_name |
> | --- | --------- |
> | 10  | IT        |
> | 20  | HR        |

### ðŸ“ Answer

```sql
-- Using IN
SELECT name
FROM employee
WHERE dept_id IN (
  SELECT id FROM department WHERE dept_name = 'IT'
);

-- OUTPUT:
-- Asha
-- Meena

--------------------------------------

-- Using EXISTS
SELECT e.name
FROM employee e
WHERE EXISTS (
  SELECT 1 FROM department d WHERE d.id = e.dept_id AND d.dept_name = 'IT'
);

-- OUTPUT:
-- Asha
-- Meena
```

| **IN**                | **EXISTS**             |
| --------------------- | ---------------------- |
| Checks values list    | Checks row existence   |
| Subquery runs first   | Stops when match found |
| Slower for large data | Faster for large data  |

```
## roadmap\database\README.md

```text
# Database

Database topics are currently contained within the original Backend section. They will be separated during the database-content migration phase without modifying the original source.

```
## knowledge\visual-notes\backend\sql-joins.png

- Visual asset exists: `knowledge\visual-notes\backend\sql-joins.png`
- File size: 386909 bytes

