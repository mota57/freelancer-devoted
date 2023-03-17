# freelancer-devoted
* extract data from devotedcolumbus


## Instructions

* Basically just type in the console for example `node main.js vendor-full-data` and it will pull the data from venues part. 
Also you have the commands `venues-full-data` or `blog-full-data`. The files will be downloaded at the static folder.


## Output help command list:

Usage: pull data https://www.devotedcolumbus.com [options] [command]

Pull data and exported to json. 

Options:
  -V, --version               output the version number
  -h, --help                  display help for command

Commands:
  venues-test-data [options]  Pull a single venues data from urls
  venues-full-data [options]  Pull venues data from urls
  vendor-test-data [options]  Pull single vendor posts data [ONLY SUPPORT JSON]
  vendor-full-data [options]  Pull full vendor posts data [ONLY SUPPORT JSON]
  blog-test-data [options]    Pull single blog posts data [ONLY SUPPORT JSON]
  blog-full-data [options]    Pull all posts from all the blog pages [ONLY SUPPORT JSON]
  help [command]              display help for command
