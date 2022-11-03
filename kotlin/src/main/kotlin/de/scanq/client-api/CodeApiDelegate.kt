package de.scanq.client-api

import de.scanq.models.QRCodeBaseData
import de.scanq.models.QRCodeCreateData
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.core.io.Resource

import java.util.Optional

/**
 * A delegate to be called by the {@link CodeApiController}}.
 * Implement this interface with a {@link org.springframework.stereotype.Service} annotated class.
 */
@jakarta.annotation.Generated(value = ["org.openapitools.codegen.languages.KotlinSpringServerCodegen"])
interface CodeApiDelegate {

    fun getRequest(): Optional<NativeWebRequest> = Optional.empty()

    /**
     * @see CodeApi#createQRCode
     */
    fun createQRCode(qrCodeCreateData: QRCodeCreateData): ResponseEntity<QRCodeBaseData> {
        getRequest().ifPresent { request ->
            for (mediaType in MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    ApiUtil.setExampleResponse(request, "application/json", "{  \"image\" : \"\",  \"serialNumber\" : \"046b6c7f-0b8a-43b9-b35d-6489e6daee91\",  \"url\" : \"url\"}")
                    break
                }
            }
        }
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)

    }


    /**
     * @see CodeApi#deactivateQRCode
     */
    fun deactivateQRCode(serialNumber: java.util.UUID): ResponseEntity<Unit> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)

    }


    /**
     * @see CodeApi#editQRCode
     */
    fun editQRCode(serialNumber: java.util.UUID,
        qrCodeCreateData: QRCodeCreateData): ResponseEntity<QRCodeBaseData> {
        getRequest().ifPresent { request ->
            for (mediaType in MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    ApiUtil.setExampleResponse(request, "application/json", "{  \"image\" : \"\",  \"serialNumber\" : \"046b6c7f-0b8a-43b9-b35d-6489e6daee91\",  \"url\" : \"url\"}")
                    break
                }
            }
        }
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)

    }


    /**
     * @see CodeApi#getQRCode
     */
    fun getQRCode(serialNumber: java.util.UUID): ResponseEntity<QRCodeBaseData> {
        getRequest().ifPresent { request ->
            for (mediaType in MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    ApiUtil.setExampleResponse(request, "application/json", "{  \"image\" : \"\",  \"serialNumber\" : \"046b6c7f-0b8a-43b9-b35d-6489e6daee91\",  \"url\" : \"url\"}")
                    break
                }
            }
        }
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)

    }

}
