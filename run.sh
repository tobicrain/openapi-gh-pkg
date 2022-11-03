

#! /bin/sh

rpl "</project>" "$(cat distributionManagement.txt)</project>" kotlin/pom.xml
rpl "</properties>" "<spring-boot.repackage.skip>true</spring-boot.repackage.skip></properties>" kotlin/pom.xml