package de.scanq.client-api

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import java.util.Optional

@jakarta.annotation.Generated(value = ["org.openapitools.codegen.languages.KotlinSpringServerCodegen"])
@Controller
@RequestMapping("\${openapi.scanq-client-api.base-path:}")
class CodeApiController(
        @org.springframework.beans.factory.annotation.Autowired(required = false) delegate: CodeApiDelegate?
) : CodeApi {
    private val delegate: CodeApiDelegate

    init {
        this.delegate = Optional.ofNullable(delegate).orElse(object : CodeApiDelegate {})
    }

    override fun getDelegate(): CodeApiDelegate = delegate
}
