package com.policalum.erp.application.dto.request;

import jakarta.validation.constraints.NotNull;

public record ArchivoBandejaRequest(@NotNull Boolean archivado) {}
