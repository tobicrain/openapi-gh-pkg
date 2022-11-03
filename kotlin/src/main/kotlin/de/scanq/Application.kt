package de.scanq

import org.springframework.boot.runApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.ComponentScan

@SpringBootApplication
@ComponentScan(basePackages = ["de.scanq", "de.scanq.client-api", "de.scanq.models"])
class Application

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
