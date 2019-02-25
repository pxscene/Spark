# Running testRunner with Screenshot Comparisons 

Because the current screenshot comparison mechanism is sensitive to even small deviations across devices using the same OS, we have a utility that allows for easy capture of images for validation. Images can be captured from a release version of Spark as well as a custom build of Spark, then the captured images can then be compared manually or with the tool of your choice to determine if any regressions have been introduced in the custom build.

Execute the following steps for each of the builds to be compared, capturing images from each build in separate directories:
1. testRunner_screenshot.js can be run with a flag to indicate that screenshots should be written out to the console log.  Run testRunner_screenshot.js with command line options `screenshot=true` and `dumpScreenshot=true` and redirect the testrunner logs to a file, for example: 
`./Spark https://www.sparkui.org/tests-ci/test-run/testRunner_screenshot.js?tests=file:<path to tests.json file>%26screenshot=true%26dumpScreenShot=true 2&>logfile`
2. Download the script dumpImage.sh from https://www.sparkui.org/tests-ci/ImageGenerator/dumpImage.sh to Linux or OSX
3. Do `chmod 777 dumpImage.sh`
4. Run the script as : ./dumpImage.sh <path to logfile taken from step1> <directory path where images need to be stored>.  For example: `./dumpImage.sh logfile screenShotImages`
5. After step 4, screenShotImages will have the set of screenshot images taken as part of testRunner_screenshot execution in .png format.  For example: 
`user@user-VirtualBox:~/pxscene_latest/pxCore/examples/pxScene2d/src$ ls -rlt user/`
`total 120`
`-rw-rw-r-- 1 user user 21520 Jan 17 19:31 dirty_rect_tests_rectangleTestx0y0.png`
`-rw-rw-r-- 1 user user 21386 Jan 17 19:31 dirty_rect_tests_rectangleTestx100y0.png`
`-rw-rw-r-- 1 user user 21613 Jan 17 19:31 dirty_rect_tests_rectangleTestx100y100.png`
`-rw-rw-r-- 1 user user 22664 Jan 17 19:31 dirty_rect_tests_rectangleTestx200y200.png`
`-rw-rw-r-- 1 user user 22886 Jan 17 19:31 dirty_rect_tests_rectangleTestx300y500.png`

The idea is that a developer could run testRunner_screenshot once, in screen capture mode, with say, a released version of Spark; then they would run the utility to get a directory full of screenshot images from that release.

Subsequently, they could run testRunner_screenshot in screen capture mode with their own set of Spark changes; then they would run the utility to get a directory full of screenshot images from their own version of Spark.

For now, they could then compare the two sets of images by hand (or with some readily available binary compare tool) to see if their Spark changes caused any unexpected screen changes.

