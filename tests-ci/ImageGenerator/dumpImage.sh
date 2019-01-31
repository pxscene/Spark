#!/bin/sh
#works on ubuntu and osx
#dumpImage.sh  <logfile path> <directory to dump image files>

if [ $# -ne 2 ]
then
  echo "wrong number of parameters. please run as dumpImage.sh <logfile absolute path> <directory to dump image files>"
  exit 1
fi

logfile=$1
imagedir=$2
machine=""

unameoutput="$(uname -s)"
case "${unameoutput}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    *)          echo "Machine is unknown !!, exiting ...";exit 1;
esac

echo "machine is ${machine}"
echo "logfile is ${logfile}"
echo "image directory is ${imagedir}"

if [ ! -e $logfile ]
then
  echo "Logfile is not present , please verify and try again !!"
  exit 1
fi

filenames=`grep "VALIDATION IMAGE" $logfile|awk -F":" '{print $2}'`
read -r -a filenamelist <<< $filenames

imgdata=`grep "VALIDATION IMAGE" $logfile|awk -F":" '{print $3}'`
read -r -a imgdatalist <<< $imgdata

numimages=${#imgdatalist[@]}

if [ $numimages -eq 0 ]
then
  echo "Logfile does not have image data !!"
  exit 1
fi

for index in "${!filenamelist[@]}"
do
    filename=${filenamelist[index]}
    imgbytes=${imgdatalist[index]}
    imgbytes="${imgbytes:1:${#imgbytes}-2}"
    if [ ! -e $imagedir ]
    then
      mkdir $imagedir
    fi
    echo $imgbytes > "$imagedir/$filename.b64"
    if [ "$machine" == "Linux" ]
    then
    base64 -d "$imagedir/$filename.b64" > "$imagedir/$filename"
    else
    base64 -D -i "$imagedir/$filename.b64" -o "$imagedir/$filename"
    fi
    rm -rf "$imagedir/$filename.b64"
    echo "Generated $imagedir$filename"
done
