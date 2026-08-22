package com.dayflow.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PayrollUpdateRequest {

    @NotNull(message = "Base salary is required")
    @PositiveOrZero(message = "Base salary cannot be negative")
    private BigDecimal baseSalary;

    @NotNull(message = "Allowances amount is required")
    @PositiveOrZero(message = "Allowances cannot be negative")
    private BigDecimal allowances;

    @NotNull(message = "Deductions amount is required")
    @PositiveOrZero(message = "Deductions cannot be negative")
    private BigDecimal deductions;

    @NotNull(message = "Effective date is required")
    private LocalDate effectiveFrom;
}
