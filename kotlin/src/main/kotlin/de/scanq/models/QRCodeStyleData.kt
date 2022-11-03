package de.scanq.models

import java.util.Objects
import com.fasterxml.jackson.annotation.JsonProperty
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
 * @param fileName Name of QR Code image file
 * @param propertySize Size of QR Code in Pixel
 * @param margin Amount of space in pixels to add as a margin around the rendered QR Code
 * @param brightColor Color to be used for the \"bright\" parts of the QR Code. As HEX string
 * @param darkColor Color to be used for the \"dark\" parts of the QR Code. As HEX string
 * @param marginColor Color to be used for the \"margin\" part of the QR Code. As HEX string
 */
data class QRCodeStyleData(

    @Schema(example = "null", description = "Name of QR Code image file")
    @field:JsonProperty("fileName") val fileName: kotlin.String? = "QRcode.png",

    @Schema(example = "null", description = "Size of QR Code in Pixel")
    @field:JsonProperty("size") val propertySize: kotlin.Int? = 25,

    @Schema(example = "null", description = "Amount of space in pixels to add as a margin around the rendered QR Code")
    @field:JsonProperty("margin") val margin: kotlin.Int? = 0,

    @Schema(example = "null", description = "Color to be used for the \"bright\" parts of the QR Code. As HEX string")
    @field:JsonProperty("brightColor") val brightColor: kotlin.String? = null,

    @Schema(example = "null", description = "Color to be used for the \"dark\" parts of the QR Code. As HEX string")
    @field:JsonProperty("darkColor") val darkColor: kotlin.String? = null,

    @Schema(example = "null", description = "Color to be used for the \"margin\" part of the QR Code. As HEX string")
    @field:JsonProperty("marginColor") val marginColor: kotlin.String? = null
) {

}

