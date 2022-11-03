package de.scanq.models

import java.util.Objects
import com.fasterxml.jackson.annotation.JsonProperty
import de.scanq.models.QRCodeStyleData
import javax.validation.constraints.DecimalMax
import javax.validation.constraints.DecimalMin
import javax.validation.constraints.Email
import javax.validation.constraints.Max
import javax.validation.constraints.Min
import javax.validation.constraints.NotNull
import javax.validation.constraints.Pattern
import javax.validation.constraints.Size
import javax.validation.Valid
import io.swagger.v3.oas.annotations.media.Schema

/**
 * 
 * @param url 
 * @param styleData 
 */
data class QRCodeCreateData(

    @Schema(example = "null", required = true, description = "")
    @field:JsonProperty("url", required = true) val url: kotlin.String,

    @field:Valid
    @Schema(example = "null", description = "")
    @field:JsonProperty("styleData") val styleData: QRCodeStyleData? = null
) {

}

