#! /bin/bash

read -r -p "This will restart Chrome, is that ok? [Y/n] " response

case $response in
    [yY][eE][sS]|[yY])
        killall Google\ Chrome
        sleep 1s
        open -a Google\ Chrome --args --allow-file-access-from-files
        ;;
    *)
        echo "Ok I won't do it then!"
        exit
        ;;
esac
