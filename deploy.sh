#!/bin/bash

rsync -a -v -z ./website/ ubuntu@84.12.106.132:/var/html/roadmap/
