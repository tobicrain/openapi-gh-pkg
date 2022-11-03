

#! /bin/sh


# USAGE=$(cat <<-END
#     <distributionManagement>
#         <repository>
#             <id>github</id>
#             <name>GitHub tandamo Apache Maven Packages</name>
#             <url>https://maven.pkg.github.com/tandamo/scanq-client-api</url>
#         </repository>
#     </distributionManagement>
# </project>
# END
# )


sed -i '' -e '$ d' kotlin/pom.xml
printf "$(cat distributionManagement.txt)" >> kotlin/pom.xml

rpl "</properties>" "<spring-boot.repackage.skip>true</spring-boot.repackage.skip></properties>" kotlin/pom.xml
# sed '/<\/properties>/e cat properties.txt' kotlin/pom.xml