<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'requester_id' => $this->requester_id,
            'requester' => $this->whenLoaded('requester', function() {
                return new UserResource($this->requester);
            }),
            'department_id' => $this->department_id,
            'department' => $this->whenLoaded('department', function() {
                return new DepartmentResource($this->department);
            }),
            'type' => $this->type,
            'status' => $this->status,
            'title' => $this->title,
            'description' => $this->description,
            'total_cost' => $this->total_cost,
            'submitted_at' => $this->submitted_at,
            'completed_at' => $this->completed_at,
            'items' => $this->whenLoaded('items', function() {
                return RequestItemResource::collection($this->items);
            }),
            'project_detail' => $this->whenLoaded('projectDetail', function() {
                return new ProjectDetailResource($this->projectDetail);
            }),
            'approval_history' => $this->whenLoaded('approvalHistory', function() {
                return ApprovalHistoryResource::collection($this->approvalHistory);
            }),
            'attachments' => $this->whenLoaded('attachments', function() {
                return AttachmentResource::collection($this->attachments);
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}