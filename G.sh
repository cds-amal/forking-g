#!/bin/bash


# quick and dirty

trap ctrl_c INT

outfile=$1

function ctrl_c () {
  printf "\n"
  cp $$.tmp xyz
  grep "^..._" $$.tmp | sort -r | uniq -c > $outfile
  grep "^..._" $$.tmp | sort -r | uniq -c | awk '{ sum += $1 } END { print sum " total calls"}' >> $outfile
  rm $$.tmp
  echo "exiting"
  exit 0
}

ganache \
  -v \
  -m "window twenty cat alone physical foam smoke annual collect pluck educate course" \
  -p 8545 > $$.tmp
