import React, { Children, ReactNode } from "react";

export function Condition(props: { children: ReactNode }) {
    let when: ReactNode | null = null;
    let otherwise: ReactNode | null = null;

    Children.forEach(props.children, (child) => {
        if (React.isValidElement(child)) {
            if ((child.props as any).isTrue === undefined) {
                otherwise = child;
            } else if (!when && (child.props as any).isTrue === true) {
                when = child;
            }
        }
    });

    return when || otherwise;
}

Condition.When = ({ isTrue, children }: { isTrue: boolean; children: ReactNode }) => (isTrue ? children : null);
Condition.Else = ({ render, children }: { render?: ReactNode; children: ReactNode }) => (render !== undefined ? render : children);