package com.dayflow.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalanceDto {
    private int paidTotal = 15;
    private int paidUsed;
    private int paidRemaining;

    private int sickTotal = 10;
    private int sickUsed;
    private int sickRemaining;

    private int unpaidUsed;
}
